import env from '#start/env'
import { BaseMail } from '@adonisjs/mail'
import User from '#common/models/user'
import ResetPasswordEmail from '#auth/emails/reset_password_email'
import router from '@adonisjs/core/services/router'
import { renderToString } from 'react-dom/server'

export default class ResetPasswordNotification extends BaseMail {
  from = `Panache <${env.get('EMAIL_FROM')}>`
  subject = `Reset your password for Panache`

  constructor(private user: User) {
    super()
  }
  async prepare() {

    const signedUrl = router.makeSignedUrl(
      'auth.reset_password.show',
      { email: this.user.email },
      { expiresIn: '15m', prefixUrl: env.get('APP_URL'), purpose: 'reset_password' }
    )
    this.message.to(this.user.email)
    const html = renderToString(ResetPasswordEmail({ user: this.user, signedUrl }))
    this.message.html(html)
  }
}
