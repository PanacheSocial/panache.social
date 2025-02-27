import User from '#common/models/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import mail from '@adonisjs/mail/services/main'
import OTPNotification from '#auth/notifications/otp_notification'
import { generateOtp } from '#auth/utils/otp'
import redis from '@adonisjs/redis/services/main'

export default class SignUpController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/sign_up')
  }

  @inject()
  async handle({ request, response, i18n, session }: HttpContext) {
    const signUpValidator = vine.compile(
      vine.object({
        gender: vine.enum(['male', 'female']),
        firstName: vine.string().trim().minLength(1).maxLength(255),
        lastName: vine.string().trim().minLength(1).maxLength(255),
        username: vine
          .string()
          .minLength(3)
          .maxLength(255)
          .trim()
          .regex(/^[a-zA-Z0-9._%+-]+$/)
          .toLowerCase()
          .unique(async (db, value) => {
            const userFoundByUsername = await db.from('users').where('username', value).first()
            const profileFoundByUsername = await db.from('users').where('username', value).first()
            return !userFoundByUsername && !profileFoundByUsername
          }),
        email: vine
          .string()
          .email()
          .trim()
          .normalizeEmail()
          .unique(async (db, value) => {
            const userFoundByEmail = await db.from('users').where('email', value).first()
            return !userFoundByEmail
          }),
        password: vine.string().minLength(8),
      })
    )

    const payload = await request.validateUsing(signUpValidator)

    const userAlreadyExists = await User.findBy('username', payload.username)
    if (userAlreadyExists !== null) {
      session.flash('errors.email', i18n.t('auth.username_already_exists'))
      return response.redirect().back()
    }

    const verification_code = generateOtp()
    const verification_code_expires_at = new Date(Date.now() + 1000 * 60 * 5) // 5 minutes

    // save verification code in Redis
    await redis.set(
      `otp:emailverification:${payload.email}`,
      JSON.stringify({
        code: verification_code,
        expiresAt: verification_code_expires_at,
      }),
      'EX',
      60 * 5 + 180 // 5 minutes + 3 minutes
    )

    const user = await User.create({
      ...payload,
      locale: i18n?.locale,
    })
    await user.save()

    const profile = await user.related('profiles').create({ username: user.username })
    user.currentProfileId = profile.id
    await user.save()

    session.put('isNewUser', true)
    session.put('userEmail', user.email)

    await mail.sendLater(new OTPNotification(user))

    return response.redirect().toRoute('auth.otp.show')
  }
}
