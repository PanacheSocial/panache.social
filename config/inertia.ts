import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps, PageProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    flashMessages: (ctx) => ctx.session?.flashMessages.all(),
    errors: (ctx) => ctx.inertia.always(() => ctx.session?.flashMessages.get('errors')),
    success: (ctx) => ctx.inertia.always(() => ctx.session?.flashMessages.get('success')),
    user: (ctx) => ctx.auth?.user,
    translations: (ctx) => ctx.inertia.always(() => ctx.i18n?.localeTranslations),
    path: (ctx) => ctx.request.url(),
    query: (ctx) => ctx.request.qs(),
    locale: (ctx) => ctx.i18n?.locale,
    params: (ctx) => ctx.params,
    route: (ctx) => ctx.route?.name,
  },

  /**
   * Path to the client-side entrypoint
   */
  entrypoint: 'app/core/ui/app/app.tsx',

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'app/core/ui/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig>, PageProps {}
}

declare module 'vite' {
  interface ImportMeta {
    readonly env: Record<string, string>
  }
}
