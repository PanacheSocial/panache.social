'use client'

import * as React from 'react'
import { BotIcon, MailsIcon, MessagesSquare, Share2Icon } from 'lucide-react'

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
import { Badge } from './badge.js'

export function AppSidebar({
  children,
  moduleName,
  ...props
}: React.ComponentProps<typeof Sidebar> & { moduleName: string }) {
  const user = useUser()
  const t = useTranslate()
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SwitchProductMenu moduleName={moduleName} />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
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

function SwitchProductMenu({ moduleName }: { moduleName: string }) {
  const path = usePath()
  const t = useTranslate()
  const products: {
    title: string
    href: string
    description: string
    icon: React.ReactNode
    isCurrent: boolean
    isComingSoon?: boolean
  }[] = [
    {
      title: 'Panache Social',
      href: '/',
      description: t('common.social_description'),
      icon: <MessagesSquare className="h-4 w-4 mr-2 text-primary" />,
      isCurrent: !path.startsWith('/ai') && !path.startsWith('/emails'),
    },
    {
      title: 'Panache AI',
      href: '/ai',
      description: t('common.ai_description'),
      icon: <BotIcon className="h-4 w-4 mr-2 text-primary" />,
      isCurrent: path.startsWith('/ai'),
      isComingSoon: true,
    },
    {
      title: 'Panache Emails',
      href: '/emails',
      description: t('common.emails_description'),
      icon: <MailsIcon className="h-4 w-4 mr-2 text-primary" />,
      isCurrent: path.startsWith('/emails'),
      isComingSoon: true,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuItem className="p-2 flex space-x-2 flex-wrap hover:bg-sidebar-accent rounded-lg cursor-pointer">
          <Logo />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Panache</span>
            <span className="truncate text-xs">{moduleName}</span>
          </div>
        </SidebarMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid w-[400px] gap-3 p-4 mx-4 my-2 md:grid-cols-2">
        {products.map((product) => (
          <ProductItem
            key={product.title}
            title={product.title}
            icon={product.icon}
            href={product.href}
            isCurrent={product.isCurrent}
            isComingSoon={product.isComingSoon}
          >
            {product.description}
          </ProductItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ProductItem = ({
  className,
  title,
  children,
  icon,
  href,
  isCurrent,
  isComingSoon,
}: {
  className?: string
  title: string
  children: React.ReactNode
  icon: React.ReactNode
  href: string
  isCurrent: boolean
  isComingSoon?: boolean
}) => {
  const t = useTranslate()
  return (
    <Link
      className={cn(
        'h-full flex p-3 no-underline outline-none transition-colors rounded-md leading-none focus:bg-accent focus:text-accent-foreground',
        isCurrent && 'bg-sidebar-accent/20 border',
        isComingSoon
          ? 'cursor-default opacity-60'
          : 'hover:bg-sidebar-accent/20 hover:text-accent-foreground'
      )}
      href={isComingSoon ? '' : href}
      disabled={isComingSoon}
    >
      <div>{icon}</div>
      <div className={cn('block select-none space-y-1', className)}>
        <div className="text-sm font-medium leading-none flex items-start space-x-2 space-y-2">
          <span>{title}</span>
          {isComingSoon && (
            <Badge variant="secondary" className="mt-full">
              {t('common.soon')}
            </Badge>
          )}
        </div>
        <p className="text-sm leading-snug text-muted-foreground flex flex-wrap">{children}</p>
      </div>
    </Link>
  )
}
