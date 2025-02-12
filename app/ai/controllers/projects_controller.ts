import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'
import { Get, Middleware } from '@softwarecitadel/girouette'

export default class ProjectsController {
  @Get('/ai/projects', 'ai.projects.index')
  @Middleware(middleware.auth())
  async index({ auth, inertia }: HttpContext) {
    const projects = await auth.user?.related('projects').query().paginate(1, 20)
    return inertia.render('ai/projects', { projects })
  }
}
