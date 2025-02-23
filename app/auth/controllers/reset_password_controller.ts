import User from '#common/models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class ResetPasswordController {
  async show({ request, inertia, response }: HttpContext) {
    /**
     * Verify the request signature before proceeding.
     */
    if (!request.hasValidSignature('reset_password')) {
      return response.redirect().toRoute('auth.forgot_password.show')
    }

    /**
     * Render the "Reset Password" page.
     */
    const email = request.param('email')
    const signature = request.input('signature')

    return inertia.render('auth/reset_password', {
      email,
      signature,
    })
  }

  async handle({ request, params, response }: HttpContext) {
    /**
     * Verify the request signature before proceeding.
     */
    if (!request.hasValidSignature('reset_password')) {
      return response.redirect().toRoute('auth.forgot_password.show')
    }

    /**
     * Validate the request input.
     */
    const resetPasswordValidator = vine.compile(
      vine.object({
        password: vine
          .string()
          .minLength(8)
          .maxLength(255)
          .confirmed({ confirmationField: 'confirmationPassword' }),
      })
    )
    const validatedData = await request.validateUsing(resetPasswordValidator)

    /**
     * Handle the password reset request.
     */
    const user = await User.findByOrFail('email', params.email)
    user.password = validatedData.password
    await user.save()

    /**
     * Redirect to the login page.
     */
    return response.redirect().toRoute('auth.sign_in.show')
  }
}
