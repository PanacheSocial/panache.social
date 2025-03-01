import User from '#common/models/user'
import WebhooksService from '#common/services/webhooks_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import OTPNotification from '#auth/notifications/otp_notification'
import { generateOtp } from '#auth/utils/otp'
import mail from '@adonisjs/mail/services/main'

export default class OtpController {
  async show({ inertia, session, response }: HttpContext) {
    if (!session.get('isNewUser')) {
      return response.redirect().toRoute('auth.sign_up.show')
    }

    return inertia.render('auth/otp')
  }

  @inject()
  async handle(
    { auth, request, response, i18n, session }: HttpContext,
    webhooksService: WebhooksService
  ) {
    try {
      const user = await User.findBy('email', session.get('userEmail'))

      if (!user) {
        return response.redirect().back()
      }

      // TODO: Implement rate limiting for OTP verification

      const verificationCode = request.input('verification_code')
      if (!verificationCode || user.verification_code !== verificationCode) {
        session.flash('errors.auth', i18n.t('auth.invalid_otp'))
        return response.redirect().back()
      }

      user.merge({
        email_verified_at: new Date(),
        verification_code: null,
        verification_code_expires_at: null,
        email_verified: true,
      })

      session.forget('userEmail')
      session.forget('isNewUser')

      await user.save()
      await auth.use('web').login(user)
      if (auth.user) {
        await webhooksService.send(`[+] [User ${auth.user.id} signed up]`)
      }

      return response.redirect('/')
    } catch (error) {
      session.flash('errors.auth', i18n.t('auth.invalid_otp'))
      return response.redirect().back()
    }
  }

  @inject()
  async resend({ response, session, i18n }: HttpContext) {
    try {
      const user = await User.findBy('email', session.get('userEmail'))

      if (!user) {
        return response.redirect().toRoute('auth.sign_up.show')
      }

      // TODO: Implement rate limiting for OTP resend

      const verificationCode = generateOtp()
      const verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 5)

      user.merge({
        verification_code: verificationCode,
        verification_code_expires_at: verificationCodeExpiresAt,
      })
      await user.save()

      session.flash('success.auth', i18n.t('auth.otp_sent'))
      await mail.send(new OTPNotification(user))

      return response.redirect().back()
    } catch (error) {
      session.flash('errors.auth', i18n.t('auth.otp_not_sent'))
      return response.redirect().back()
    }
  }
}
