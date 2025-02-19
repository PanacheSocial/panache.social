import { AppSidebar } from '#common/ui/components/app_sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '#common/ui/components/sidebar'
import React from 'react'
import { NavRooms } from './rooms/nav_rooms'
import { Head, Link } from '@inertiajs/react'
import { buttonVariants } from '#common/ui/components/button'
import { useTranslateFunc } from '#common/ui/hooks/use_translate'
import { Home, PlusCircleIcon, Telescope, TrendingUp } from 'lucide-react'
import { SearchInput } from './search_input'
import { Toaster } from '#common/ui/components/toaster'
import { SocialDropdown } from './social_dropdown'
import { cn } from '#common/ui/lib/utils'
import Room from '#social/models/room'
import { NavMain } from '#common/ui/components/nav_main'
import User from '#common/models/user'

export type SocialLayoutProps = React.PropsWithChildren<{
  pageProps: {
    popularRooms: Room[]
    joinedRooms?: Room[]
    translations: Record<string, string>
    user?: User
    path: string
  }
}>

const getMenu = (t: (key: string) => string, path: string, authenticated: boolean) => {
  const popularPath = authenticated ? '/popular' : '/'
  const navMain = [
    {
      title: t('social.popular'),
      icon: TrendingUp,
      url: popularPath,
      isActive: path === popularPath,
    },
    {
      title: t('social.explore'),
      icon: Telescope,
      url: '/rooms',
      isActive: ['/rooms', '/posts', '/comments'].includes(path),
    },
  ]

  if (authenticated) {
    return [
      {
        title: t('common.home'),
        url: '/',
        icon: Home,
        isActive: path === '/',
      },
      ...navMain,
    ]
  }

  return navMain
}

function SocialLayoutC({
  children,
  pageProps: { popularRooms, joinedRooms, user, translations, path },
}: SocialLayoutProps) {
  const t = useTranslateFunc(translations)

  return (
    <>
      <SidebarProvider>
        <AppSidebar moduleName="Social">
          <NavMain items={getMenu(t, path, !!user)} />

          {joinedRooms && joinedRooms.length > 0 && (
            <NavRooms title={t('social.rooms')} rooms={joinedRooms} />
          )}
          <NavRooms title={t('social.popular')} rooms={popularRooms} />
        </AppSidebar>
        <SidebarInset>
          <header className="flex py-2 sm:py-0 sm:h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex flex-wrap w-full justify-between items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <SearchInput />
              <div className="flex items-center w-full sm:w-auto justify-between gap-4">
                <Link
                  className={cn(
                    buttonVariants({ variant: 'secondary' }),
                    !user && '!cursor-not-allowed opacity-50'
                  )}
                  href={user ? '/create' : ''}
                >
                  <PlusCircleIcon className="h-4 w-4" />
                  <span>{t('social.create_a_post')}</span>
                </Link>
                <SocialDropdown />
              </div>
            </div>
          </header>
          <Toaster />

          <main className="p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
const SocialLayout = (page: any) => <SocialLayoutC pageProps={page.props}>{page}</SocialLayoutC>

export default SocialLayout
