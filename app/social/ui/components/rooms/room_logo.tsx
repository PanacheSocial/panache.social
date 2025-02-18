import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import { cn } from '#common/ui/lib/utils'
import Room from '#social/models/room'
import React from 'react'

export type RoomLogoProps = {
  room: Room
  className?: string
}

export function RoomLogo({ room, className }: { room: Room; className?: string }) {
  return (
    <Avatar className={cn('h-9 w-9 border', className)}>
      <AvatarImage src={room.logo || `https://avatar.vercel.sh/${room.slug}`} alt={room.slug} />
    </Avatar>
  )
}
