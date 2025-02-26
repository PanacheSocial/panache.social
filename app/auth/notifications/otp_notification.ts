import env from '#start/env'
import { BaseMail } from '@adonisjs/mail'
import User from '#common/models/user'
import { OtpEmail } from '#auth/emails/otp_email'
import { renderToString } from 'react-dom/server'

export default class OTPNotification extends BaseMail {
  from = `Panache <${env.get('EMAIL_FROM')}>`
  subject = `Verify your email address for Panache`

  constructor(private user: User) {
    super()
  }
  async prepare() {
    this.message.to(this.user.email)
    const html = renderToString(OtpEmail({ user: this.user }))
    this.message.html(html)
  }
}
