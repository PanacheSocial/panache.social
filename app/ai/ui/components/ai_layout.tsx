import { AppSidebar } from '#common/ui/components/app_sidebar'
import { SidebarProvider, SidebarInset } from '#common/ui/components/sidebar'
import { Head } from '@inertiajs/react'
import React from 'react'
import { NavProjects } from './nav_projects'
import { NavMain } from '#common/ui/components/nav_main'
import useTranslate from '#common/ui/hooks/use_translate'
import { Home } from 'lucide-react'
import usePath from '#common/ui/hooks/use_path'
import { NavChats } from './nav_chats'

export interface AiLayoutProps extends React.PropsWithChildren {}

export function AiLayout({ children }: AiLayoutProps) {
  const t = useTranslate()
  const path = usePath()

  return (
    <>
      <Head>
        <title>Panache AI</title>
      </Head>

      <SidebarProvider>
        <AppSidebar moduleName="AI">
          <NavMain
            items={[
              {
                title: t('common.home'),
                url: '/ai',
                icon: Home,
                isActive: path === '/ai',
              },
            ]}
          />

          <NavProjects />

          <NavChats />
        </AppSidebar>

        <SidebarInset>
          <main className="p-8 min-h-full">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
