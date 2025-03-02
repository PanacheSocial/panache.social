import User from '#common/models/user'
import WebhooksService from '#common/services/webhooks_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import OTPNotification from '#auth/notifications/otp_notification'
import { generateOtp } from '#auth/utils/otp'
import mail from '@adonisjs/mail/services/main'
import redis from '@adonisjs/redis/services/main'

export default class OtpController {
  async show({ inertia, session, response }: HttpContext) {
    if (!session.get('isNewUser')) {
      return response.redirect().toRoute('auth.sign_up.show')
    }

    // Send OTP when user lands on the page (since we expect them to verify)
    if (session.get('resendVerificationEmail', false)) {
      await this.sendOtp(session)
      session.forget('resendVerificationEmail')
    }

    return inertia.render('auth/otp')
  }

  // Helper function to fetch user
  private async getUser(session: HttpContext['session']) {
    return User.findBy('email', session.get('userEmail'))
  }

  // Helper function to send OTP and store in Redis
  private async sendOtp(session: HttpContext['session']) {
    const user = await this.getUser(session)
    if (!user) return

    const verificationCode = generateOtp()
    const actualExpiry = new Date(Date.now() + 1000 * 60 * 5) // 5 minutes
    const bufferExpiry = new Date(actualExpiry.getTime() + 1000 * 60 * 2) // Extra 2 minutes buffer

    await redis.set(
      `otp:emailverification:${session.get('userEmail')}`,
      JSON.stringify({ code: verificationCode, expiresAt: actualExpiry }),
      'EX',
      Math.floor((bufferExpiry.getTime() - Date.now()) / 1000) // Store for 7 minutes
    )

    await mail.send(new OTPNotification(user))
  }

  @inject()
  async handle(
    { auth, request, response, i18n, session }: HttpContext,
    webhooksService: WebhooksService
  ) {
    try {
      const user = await this.getUser(session)
      if (!user) return response.redirect().back()

      // Check OTP in Redis
      const redisData = await redis.get(`otp:emailverification:${session.get('userEmail')}`)
      if (!redisData) return this.flashAndRedirect(session, response, i18n.t('auth.invalid_otp'))

      const { code, expiresAt } = JSON.parse(redisData)
      const expiresAtDate = new Date(expiresAt)

      if (code !== request.input('verification_code')) {
        return this.flashAndRedirect(session, response, i18n.t('auth.invalid_otp'))
      }

      if (expiresAtDate < new Date()) {
        return this.flashAndRedirect(session, response, i18n.t('auth.otp_expired')) // Show "OTP Expired"
      }

      // Remove OTP after successful verification
      await redis.del(`otp:emailverification:${session.get('userEmail')}`)

      // Mark email as verified
      user.merge({ email_verified_at: new Date(), email_verified: true })
      await user.save()

      session.forget('userEmail')
      session.forget('isNewUser')

      await auth.use('web').login(user)
      await webhooksService.send(`[+] [User ${user.id} signed up]`)

      return response.redirect('/')
    } catch {
      return this.flashAndRedirect(session, response, i18n.t('auth.invalid_otp'))
    }
  }

  @inject()
  async resend({ response, session, i18n }: HttpContext) {
    try {
      const user = await this.getUser(session)
      if (!user) return response.redirect().toRoute('auth.sign_up.show')

      session.put('resendVerificationEmail', true)
      session.flash('success.auth', i18n.t('auth.otp_sent'))

      return response.redirect().back()
    } catch {
      return this.flashAndRedirect(session, response, i18n.t('auth.otp_not_sent'))
    }
  }

  // Helper function for error handling
  private flashAndRedirect(
    session: HttpContext['session'],
    response: HttpContext['response'],
    message: string
  ) {
    session.flash('errors.auth', message)
    return response.redirect().back()
  }
}
