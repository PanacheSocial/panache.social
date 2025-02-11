'use client'

import * as React from 'react'
import { Home } from 'lucide-react'

import { NavMain } from '#common/ui/components/nav_main'
import { NavSecondary } from '#common/ui/components/nav_secondary'
import { NavUser } from '#common/ui/components/nav_user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './sidebar'
import useUser from '#common/ui/hooks/use_user'
import { buttonVariants } from './button.js'
import Logo from './logo'
import { Link } from '@inertiajs/react'
import { cn } from '#common/ui/lib/utils'
import useTranslate from '../hooks/use_translate.js'
import usePath from '../hooks/use_path.js'
import GithubIcon from './icons/github_icon.js'
import DiscordIcon from './icons/discord_icon.js'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu.js'

export function AppSidebar({ children, ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser()
  const t = useTranslate()
  const path = usePath()
  const data = {
    navMain: [
      {
        title: t('common.home'),
        url: '/',
        icon: Home,
        isActive: path === '/',
      },
    ],
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex space-x-2 flex-wrap">
                  <Logo />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Panache</span>
                    <span className="truncate text-xs">Social</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>t</DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {children}
        <NavSecondary
          className="mt-auto"
          items={[
            {
              title: 'GitHub',
              icon: <GithubIcon />,
              url: 'https://github.com/panachecompany/panache',
            },
            {
              title: 'Discord',
              icon: <DiscordIcon />,
              url: 'https://discord.gg/8kADUcuQ68',
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter className="border-t">
        {user ? (
          <NavUser />
        ) : (
          <>
            <Link
              className={cn(buttonVariants({ variant: 'default' }), '!w-full')}
              href="/auth/sign_up"
            >
              {t('auth.sign_up')}
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'secondary' }), '!w-full')}
              href="/auth/sign_in"
            >
              {t('auth.sign_in')}
            </Link>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
