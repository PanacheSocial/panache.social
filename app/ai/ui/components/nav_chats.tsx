import React from 'react'
import { MoreHorizontal, Folder, Trash2, MessageCircleIcon } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '#common/ui/components/sidebar'
import usePageProps from '#common/ui/hooks/use_page_props'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '#common/ui/components/dropdown-menu'
import useTranslate from '#common/ui/hooks/use_translate'
import { Link } from '@inertiajs/react'
import Chat from '#ai/models/chat'
import { cn } from '#common/ui/lib/utils'
import usePath from '#common/ui/hooks/use_path'

export function NavChats() {
  const { chats } = usePageProps<{ chats: Chat[] }>()
  const { isMobile } = useSidebar()
  const t = useTranslate()
  const path = usePath()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('ai.chats')}</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <Link
                className={
                  path === `/ai/chats/${item.id}` ? 'font-medium text-black bg-sidebar-accent' : ''
                }
                href={`/ai/chats/${item.id}`}
              >
                <MessageCircleIcon className="h-4 w-4" />
                <span>{item.name || item.id}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-sm"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <Link href={`/ai/chats/${item.id}`}>
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>{t('ai.view_chat')}</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>{t('ai.delete_chat')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <Link href="/ai/projects">
            <SidebarMenuButton className="text-sidebar-foreground/70 cursor-pointer">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>{t('common.view_all')}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
