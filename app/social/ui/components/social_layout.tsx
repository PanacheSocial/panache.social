import { AppSidebar } from '#common/ui/components/app_sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '#common/ui/components/sidebar'
import React from 'react'
import { NavRooms } from './rooms/nav_rooms'
import { Head, Link } from '@inertiajs/react'
import { buttonVariants } from '#common/ui/components/button'
import useTranslate from '#common/ui/hooks/use_translate'
import { Home, PlusCircleIcon } from 'lucide-react'
import { SearchInput } from './search_input'
import { Toaster } from '#common/ui/components/toaster'
import { SocialDropdown } from './social_dropdown'
import useUser from '#common/ui/hooks/use_user'
import { cn } from '#common/ui/lib/utils'
import usePageProps from '#common/ui/hooks/use_page_props'
import Room from '#social/models/room'
import { NavMain } from '#common/ui/components/nav_main'
import usePath from '#common/ui/hooks/use_path'

export type SocialLayoutProps = React.PropsWithChildren<{
  title?: string
  meta?: Record<string, string>
}>

export default function SocialLayout({ children, meta }: SocialLayoutProps) {
  const t = useTranslate()
  const user = useUser()
  const { joinedRooms, popularRooms } = usePageProps<{
    popularRooms: Room[]
    joinedRooms?: Room[]
  }>()
  const path = usePath()
  return (
    <>
      <Head>
        <title>Panache Social</title>

        {meta &&
          Object.entries(meta).map(([name, content]) => (
            <meta key={name} name={name} content={content} />
          ))}
      </Head>
      <SidebarProvider>
        <AppSidebar moduleName="Social">
          <NavMain
            items={[
              {
                title: t('common.home'),
                url: '/',
                icon: Home,
                isActive: path === '/',
              },
            ]}
          />

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
              <div className="flex items-center w-full sm:w-auto justify-between  gap-4">
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
