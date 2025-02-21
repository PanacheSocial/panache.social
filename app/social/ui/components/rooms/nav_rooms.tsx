'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#common/ui/components/sidebar'
import React from 'react'
import { CreateRoomDialog } from './create_room_dialog'
import usePageProps from '#common/ui/hooks/use_page_props'
import Room from '#social/models/room'
import { Link } from '@inertiajs/react'
import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import useParams from '#common/ui/hooks/use_params'
import { cn } from '#common/ui/lib/utils'
import { RoomLogo } from './room_logo'
import pkg from 'react-sortablejs';
const { ReactSortable } = pkg;
import { useState } from 'react'
import Spinner from '#common/ui/components/spinner'


export function NavRooms({ rooms, title }: { rooms: Room[]; title: string }) {
  const params = useParams()
  const { route } = usePageProps<{ route: string }>()

  const getFromLocalStorage = () => {
    if (typeof localStorage === 'undefined') {
      return rooms
    }
    const sortableRooms = localStorage.getItem(`sortableRooms${title}`)
    return sortableRooms ? JSON.parse(sortableRooms) : rooms
  }
  const [roomsList, setRoomsList] = useState(getFromLocalStorage())
  const [loading, setLoading] = useState(true)

  if (rooms.length > roomsList.length) {
    const newRooms = rooms.filter((room) => !roomsList.some((r) => r.slug === room.slug))
    setRoomsList([...roomsList, ...newRooms])
  }

  React.useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`sortableRooms${title}`, JSON.stringify(roomsList))
    }
  }, [roomsList])

  React.useEffect(() => {
    setRoomsList(getFromLocalStorage())
    setLoading(false)
  }, [rooms])

  if (loading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Spinner className="h-6 w-6" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        <ReactSortable list={roomsList} setList={setRoomsList}>
          {roomsList.map((room) => (
            <SidebarMenuItem key={room.name}>
              <SidebarMenuButton asChild>
                <Link
                  className={cn(
                    params.roomSlug === room.slug &&
                    route === 'rooms.show' &&
                    'font-medium text-black bg-sidebar-accent'
                  )}
                  href={`/rooms/${room.slug}`}
                >
                  <RoomLogo room={room} className="h-6 w-6 rounded-lg border" />

                  <span className="text-sidebar-foreground">{room.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </ReactSortable>

        <SidebarMenuItem>
          <CreateRoomDialog />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
