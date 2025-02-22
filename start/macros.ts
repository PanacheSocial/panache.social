import { Request } from '@adonisjs/core/http'

Request.macro('wantsJSON', function (this: Request) {
  return this.header('content-type') === 'application/json' && this.header('x-inertia') !== 'true'
})

declare module '@adonisjs/core/http' {
  interface Request {
    wantsJSON(): boolean
  }
}
