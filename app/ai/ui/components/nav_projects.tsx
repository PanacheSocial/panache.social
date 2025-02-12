import React from 'react'
import { MoreHorizontal, Folder, Trash2 } from 'lucide-react'
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
import Project from '#ai/models/project'
import useTranslate from '#common/ui/hooks/use_translate'
import { Link } from '@inertiajs/react'

export function NavProjects() {
  const { projects } = usePageProps<{ projects: Project[] }>()
  const { isMobile } = useSidebar()
  const t = useTranslate()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('ai.projects')}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={`/projects/${item.id}`}>
                <span>{item.name}</span>
              </a>
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
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>{t('ai.view_project')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>{t('ai.delete_project')}</span>
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
