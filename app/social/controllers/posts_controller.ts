import WebhooksService from '#common/services/webhooks_service'
import Post from '#social/models/post'
import PostLike from '#social/models/post_like'
import Room from '#social/models/room'
import RoomMember from '#social/models/room_member'
import PostPolicy from '#social/policies/post_policy'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'

export default class PostsController {
  async index({ auth, inertia, request }: HttpContext) {
    const postsQueryValidator = vine.compile(
      vine.object({
        searchQuery: vine.string().optional(),
        page: vine.number().positive().withoutDecimals().min(1).optional(),
      })
    )
    const data = await request.validateUsing(postsQueryValidator)

    const result = await Post.query()
      .if(data.searchQuery, (query) => {
        query.whereRaw(
          `unaccent(LOWER(title)) LIKE unaccent(?) OR unaccent(LOWER(text)) LIKE unaccent(?)`,
          [`%${data.searchQuery?.toLowerCase()}%`, `%${data.searchQuery?.toLowerCase()}%`]
        )
      })
      .preload('profile', (query) => {
        query.select('username', 'avatar')
      })
      .preload('room', (query) => {
        query.select('name')
      })
      .if(auth.isAuthenticated, (query) => {
        query.preload('likes', (query) => {
          query.where('profile_id', auth.user!.currentProfileId!)
        })
      })
      .paginate(data.page || 1, 20)

    return inertia.render('social/posts', { posts: result.all() })
  }

  async feed({ auth, request, inertia }: HttpContext) {
    const sortMethod = request.input('method', 'popular')
    const period = request.input('period', 'day')
    const page = request.input('page', 1)
    const rooms = await Room.query().orderBy('members_count', 'desc').limit(10)

    const postsQuery = Post.query().whereIn(
      'room_id',
      rooms.map((room) => room.id)
    )
    // Filter posts by the selected period
    if (sortMethod === 'popular') {
      let startDate: DateTime | null = null

      switch (period) {
        case 'day':
          startDate = DateTime.now().minus({ days: 1 })
          break
        case 'week':
          startDate = DateTime.now().minus({ weeks: 1 })
          break
        case 'month':
          startDate = DateTime.now().minus({ months: 1 })
          break
        case 'all':
          startDate = null
          break
      }

      if (startDate) {
        postsQuery.where('created_at', '>=', startDate.toString())
      }
    }

    // Sort posts based on the selected method
    switch (sortMethod) {
      case 'popular':
        postsQuery.orderBy('likes_count', 'desc')
        break
      case 'new':
        postsQuery.orderBy('created_at', 'desc')
        break
    }
    postsQuery.preloadOnce('room')
    postsQuery.preload('profile', (query) => {
      query.select('username', 'avatar')
    })
    postsQuery.paginate(page, 20)

    /**
     * Load post likes.
     */
    if (auth.isAuthenticated) {
      postsQuery.preload('likes', (query) => {
        query.where('profile_id', auth.user!.currentProfileId!)
      })
    }

    const posts = await postsQuery

    return inertia.render('social/feed', { rooms, posts })
  }

  async show({ auth, params, request, response, inertia }: HttpContext) {
    const room = await Room.findBy('slug', params.roomSlug)
    if (room === null) {
      return response.notFound('Room not found.')
    }

    const post = await Post.query()
      .where('id', params.postId)
      .andWhere('room_id', room.id)
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
        .where('room_id', room.id)
        .where('profile_id', auth.user!.currentProfileId!)
        .first()
      isMember = roomMemberFound !== null
    }

    return inertia.render('social/post', { room, post, isMember })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('social/create')
  }

  @inject()
  async store({ auth, params, request, response }: HttpContext, webhooksService: WebhooksService) {
    const room = await Room.findBy('slug', params.roomSlug)
    if (room === null) {
      return response.notFound('Room not found.')
    }

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

    const post = new Post()

    if (data.image) {
      const key = `uploads/${cuid()}.${data.image.extname}`
      await data.image.moveToDisk(key, 's3', {
        visibility: 'public',
      })
      post.image = await drive.use().getUrl(key)
    }
    post.roomId = room.id
    post.profileId = auth.user!.currentProfileId!
    post.title = data.title
    if (data.text) post.text = data.text
    if (data.link) post.link = data.link
    await post.save()

    await webhooksService.send(
      `[+] [Post ${post.id} created with title ${post.title} by profile ${post.profileId}]`
    )

    return response.redirect().toRoute('posts.show', [room.slug, post.id])
  }

  async destroy({ bouncer, params, response }: HttpContext) {
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
