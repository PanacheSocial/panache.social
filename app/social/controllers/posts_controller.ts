import WebhooksService from '#common/services/webhooks_service'
import Post from '#social/models/post'
import PostLike from '#social/models/post_like'
import Room from '#social/models/room'
import RoomMember from '#social/models/room_member'
import PostPolicy from '#social/policies/post_policy'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import { FeedService } from '#social/services/feed_service'

@inject()
export default class PostsController {
  constructor(protected feedService: FeedService) {}
  async index({ auth, inertia, request }: HttpContext) {
    const postsQueryValidator = vine.compile(
      vine.object({
        search: vine.string().optional(),
        page: vine.number().positive().withoutDecimals().min(1).optional(),
      })
    )
    const data = await request.validateUsing(postsQueryValidator)

    const result = await Post.query()
      .if(data.search, (query) => {
        query.whereRaw(
          `unaccent(LOWER(title)) LIKE unaccent(?) OR unaccent(LOWER(text)) LIKE unaccent(?)`,
          [`%${data.search?.toLowerCase()}%`, `%${data.search?.toLowerCase()}%`]
        )
      })
      .preload('profile', (query) => {
        query.select('username', 'avatar')
      })
      .preload('room', (query) => {
        query.select('name', 'slug')
      })
      .if(auth.isAuthenticated, (query) => {
        query.preload('likes', (query) => {
          query.where('profile_id', auth.user!.currentProfileId!)
        })
      })
      .paginate(data.page || 1, 20)

    return inertia.render('social/posts', { posts: result.all() })
  }

  async popular({ inertia, auth, request }: HttpContext) {
    const sortMethod = request.input('method', 'popular')
    const period = request.input('period', 'day')
    const page = request.input('page', 1)

    const feed = await this.feedService.popular(sortMethod, period, page, auth.user)

    if (request.wantsJSON()) {
      return feed
    }

    return inertia.render('social/popular', feed)
  }

  async feed({ auth, request, inertia }: HttpContext) {
    const sortMethod = request.input('method', 'popular')
    const period = request.input('period', 'day')
    const page = request.input('page', 1)

    const feed = await this.feedService.userFeed(sortMethod, period, page, auth.user)

    if (request.wantsJSON()) {
      return feed
    }

    return inertia.render('social/feed', feed)
  }

  async show({ auth, params, request, response, inertia }: HttpContext) {
    const post = await Post.query()
      .where('id', params.postId)
      .preload('profile', (query) => {
        query.select('username', 'avatar')
      })
      .preload('room')
      .first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    /**
     * Load post likes.
     */
    if (auth.isAuthenticated) {
      await post.load('likes', (query) => {
        query.where('profile_id', auth.user!.currentProfileId!)
      })
    }

    await post.load('comments', (query) => {
      const sortMethod = request.input('method', 'popular')

      // Sort posts based on the selected method
      switch (sortMethod) {
        case 'popular':
          query.orderBy('likes_count', 'desc')
          break
        case 'new':
          query.orderBy('created_at', 'desc')
          break
      }

      query.whereNull('comment_id')
      query.preload('profile', (query) => {
        query.select('username', 'avatar')
      })

      query.preload('comments', (query) => {
        query.preload('profile', (query) => {
          query.select('username', 'avatar')
        })

        /**
         * Load post likes.
         */
        if (auth.isAuthenticated) {
          query.preload('likes', (query) => {
            query.where('profile_id', auth.user!.currentProfileId!)
          })
        }
      })

      /**
       * Load comment likes.
       */
      if (auth.isAuthenticated) {
        query.preload('likes', (query) => {
          query.where('profile_id', auth.user!.currentProfileId!)
        })
      }
    })

    let isMember = false
    if (auth.isAuthenticated) {
      const roomMemberFound = await RoomMember.query()
        .where('room_id', post.roomId)
        .where('profile_id', auth.user!.currentProfileId!)
        .first()
      isMember = roomMemberFound !== null
    }

    return inertia.render('social/post', { post, isMember })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('social/create')
  }

  @inject()
  async store({ auth, params, request, response }: HttpContext, webhooksService: WebhooksService) {
    /**
     * Find room (if specified).
     */
    let room: Room | null = null
    if (params.roomSlug !== 'current-profile') {
      room = await Room.findBy('slug', params.roomSlug)
      if (room === null) {
        return response.notFound('Room not found.')
      }
    }

    /**
     * Validate post data.
     */
    const storePostValidator = vine.compile(
      vine.object({
        title: vine.string().minLength(3).maxLength(255),
        text: vine.string().minLength(10).maxLength(10000).optional(),
        link: vine.string().url().normalizeUrl().maxLength(255).optional(),
        image: vine
          .file({
            size: '5MB',
            extnames: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
          })
          .optional(),
      })
    )
    const data = await request.validateUsing(storePostValidator)

    /**
     * Create post.
     */
    const post = new Post()

    if (data.image) {
      const key = `uploads/${cuid()}.${data.image.extname}`
      await data.image.moveToDisk(key, 's3', {
        visibility: 'public',
      })
      post.image = await drive.use().getUrl(key)
    }

    post.profileId = auth.user!.currentProfileId!
    post.title = data.title

    if (room !== null) {
      post.roomId = room.id
    }

    if (data.text) {
      post.text = data.text
    }

    if (data.link) {
      post.link = data.link
    }

    await post.save()

    /**
     * Send webhook.
     */
    await webhooksService.send(
      `[+] [Post ${post.id} created with title ${post.title} by profile ${post.profileId}]`
    )

    /**
     * Redirect to post or room.
     */
    return response.redirect().toRoute('posts.show', [post.id])
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    /**
     * Find post.
     */
    const post = await Post.query()
      .where('id', params.postId)
      .preload('room', (query) => {
        query.select('slug')
      })
      .first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    if (await bouncer.with(PostPolicy).denies('delete', post)) {
      return response.forbidden('Cannot delete this post.')
    }

    await post.delete()

    return response.redirect().toRoute('rooms.show', [post.room.slug])
  }

  @inject()
  async like({ auth, params, response }: HttpContext, webhooksService: WebhooksService) {
    const post = await Post.query().where('id', params.postId).first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    await PostLike.firstOrCreate({
      profileId: auth.user!.currentProfileId!,
      postId: post.id,
    })

    await webhooksService.send(
      `[LIKE] [Post ${post.id} like by profile ${auth.user!.currentProfileId!}]`
    )

    return response.redirect().back()
  }

  async unlike({ auth, params, response }: HttpContext) {
    const post = await Post.query().where('id', params.postId).first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    const postLike = await PostLike.query()
      .where('profile_id', auth.user!.currentProfileId!)
      .andWhere('post_id', post.id)
      .first()
    if (postLike === null) {
      return response.notFound('Like not found.')
    }

    await postLike.delete()

    return response.redirect().back()
  }

  @inject()
  async report({ auth, params, request, response }: HttpContext, webhooksService: WebhooksService) {
    const post = await Post.query().where('id', params.postId).first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    await webhooksService.send(
      `[!] [Post Report] [User ${auth.user!.id}] [Post ${params.postId}] [Description ${request.input('description')}]`
    )

    return response.ok('Post reported!')
  }
}
