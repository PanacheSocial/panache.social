import Profile from '#social/models/profile'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import vine from '@vinejs/vine'

export default class ProfilesController {
  async posts({ auth, params, inertia, response }: HttpContext) {
    const profile = await Profile.query()
      .where('username', params.username)
      .select('id', 'username', 'avatar', 'displayName', 'bio', 'websiteUrl')
      .preload('posts', (query) => {
        query.orderBy('created_at', 'desc')
        query.preload('room')

        /**
         * Load post likes.
         */
        if (auth.isAuthenticated) {
          query.preload('likes', (q) => {
            q.where('profile_id', auth.user!.currentProfileId!)
          })
        }
      })
      .first()
    if (profile === null) {
      return response.notFound('Profile not found.')
    }

    return inertia.render('social/profile_posts', { profile })
  }

  async comments({ auth, params, inertia, response }: HttpContext) {
    const profile = await Profile.query()
      .where('username', params.username)
      .select('id', 'username', 'avatar', 'displayName', 'bio', 'websiteUrl')
      .preload('comments', (query) => {
        query.preload('post', (q) => {
          q.preload('room')
        })
        query.orderBy('created_at', 'desc')

        /**
         * Load post likes.
         */
        if (auth.isAuthenticated) {
          query.preload('likes', (q) => {
            q.where('profile_id', auth.user!.currentProfileId!)
          })
        }
      })
      .first()
    if (profile === null) {
      return response.notFound('Profile not found.')
    }

    return inertia.render('social/profile_comments', { profile })
  }

  async updateUsername({ auth, params, request, response }: HttpContext) {
    const profile = await auth
      .user!.related('profiles')
      .query()
      .where('id', params.profileId)
      .first()
    if (!profile) {
      return response.notFound('Profile not found.')
    }

    const updateUsernameValidator = vine.compile(
      vine.object({
        username: vine
          .string()
          .minLength(3)
          .maxLength(255)
          .trim()
          .regex(/^[a-zA-Z0-9._%+-]+$/)
          .toLowerCase()
          .unique(async (db, value) => {
            const profileFoundByUsername = await db
              .from('profiles')
              .where('username', value)
              .first()
            return !profileFoundByUsername
          }),
      })
    )
    const data = await request.validateUsing(updateUsernameValidator)

    profile.username = data.username
    await profile.save()

    return response.redirect().toPath(`/profiles/${data.username}`)
  }

  async updateAvatar({ auth, params, request, response }: HttpContext) {
    const profile = await auth
      .user!.related('profiles')
      .query()
      .where('id', params.profileId)
      .first()
    if (!profile) {
      return response.notFound('Profile not found.')
    }

    const updateAvatarValidator = vine.compile(
      vine.object({
        avatar: vine.file({
          size: '100kb',
          extnames: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
        }),
      })
    )
    const data = await request.validateUsing(updateAvatarValidator)

    const key = `uploads/${cuid()}.${data.avatar.extname}`
    await data.avatar.moveToDisk(key, 's3', {
      visibility: 'public',
    })
    profile.avatar = await drive.use().getUrl(key)
    await profile.save()

    return response.redirect().toPath(`/profiles/${profile.username}`)
  }

  async store({ auth, request, response }: HttpContext) {
    const storeUsernameValidator = vine.compile(
      vine.object({
        username: vine
          .string()
          .minLength(3)
          .maxLength(255)
          .trim()
          .regex(/^[a-zA-Z0-9._%+-]+$/)
          .toLowerCase()
          .unique(async (db, value) => {
            const profileFoundByUsername = await db
              .from('profiles')
              .where('username', value)
              .first()
            return !profileFoundByUsername
          }),
      })
    )

    const data = await request.validateUsing(storeUsernameValidator)

    const profile = await auth.user!.related('profiles').create({
      username: data.username,
    })
    auth.user!.currentProfileId = profile.id
    await auth.user!.save()

    return response.redirect().toRoute('profiles.posts', [profile.username])
  }

  async switch({ auth, params, response }: HttpContext) {
    const profile = await auth
      .user!.related('profiles')
      .query()
      .where('id', params.profileId)
      .first()
    if (!profile) {
      return response.notFound('Profile not found.')
    }

    auth.user!.currentProfileId = profile.id
    await auth.user!.save()

    return response.redirect().toRoute('profiles.posts', [profile.username])
  }

  async updateProfile({ auth, params, request, response }: HttpContext) {
    const profile = await auth
      .user!.related('profiles')
      .query()
      .where('id', params.profileId)
      .first()
    if (!profile) {
      return response.notFound('Profile not found.')
    }

    const updateProfileValidator = vine.compile(
      vine.object({
        username: vine
          .string()
          .minLength(3)
          .maxLength(255)
          .trim()
          .regex(/^[a-zA-Z0-9._%+-]+$/)
          .toLowerCase()
          .unique(async (db, value) => {
            const profileFoundByUsername = await db
              .from('profiles')
              .where('username', value)
              .whereNot('id', profile.id)
              .first()
            return !profileFoundByUsername
          })
          .optional(),
        displayName: vine.string().trim().maxLength(255).optional(),
        bio: vine.string().trim().maxLength(1000).optional(),
        websiteUrl: vine
          .string()
          .trim()
          .maxLength(255)
          .url({ protocols: ['http', 'https'] })
          .optional(),
      })
    )

    const data = await request.validateUsing(updateProfileValidator)

    profile.merge({
      ...Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined)),
    })
    await profile.save()

    return response.redirect().toPath(`/profiles/${profile.username}`)
  }
}
