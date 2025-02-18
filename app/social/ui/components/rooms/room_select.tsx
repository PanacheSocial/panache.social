import { Avatar, AvatarFallback, AvatarImage } from '#common/ui/components/avatar'
import { Label } from '#common/ui/components/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '#common/ui/components/select'
import usePageProps from '#common/ui/hooks/use_page_props'
import useTranslate from '#common/ui/hooks/use_translate'
import Room from '#social/models/room'
import React from 'react'
import { RoomLogo } from './room_logo'
import useUser from '#common/ui/hooks/use_user'
import { useCurrentProfile } from '#common/ui/hooks/use_current_profile'
import { ProfileAvatar } from '../profiles/profile_avatar'

export type RoomSelectProps = {
  rooms: Room[]
  roomSlug: string
  setRoomSlug: (roomSlug: string) => void
}

export default function RoomSelect({ roomSlug, setRoomSlug, rooms }: RoomSelectProps) {
  const t = useTranslate('social')
  const currentProfile = useCurrentProfile()

  return (
    <div className="grid gap-2">
      <Label htmlFor="roomSlug">{t('select_a_room')}</Label>
      <Select name="roomSlug" value={roomSlug} onValueChange={setRoomSlug}>
        <SelectTrigger className="w-auto">
          <div className="flex items-center space-x-2 pr-2">
            <SelectValue placeholder={t('select_a_room')} />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="current-profile">
            <div className="flex items-center space-x-2 pr-2">
              <ProfileAvatar profile={currentProfile} className="h-6 w-6" />
              <p>
                {currentProfile.displayName || `@${currentProfile.username}`}{' '}
                <span className="text-sm text-muted-foreground">({t('current_profile')})</span>
              </p>
            </div>
          </SelectItem>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>{t('select_a_room')}</SelectLabel>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.slug}>
                <div className="flex items-center space-x-2 pr-2">
                  <RoomLogo room={room} className="h-6 w-6" />
                  <span>{room.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
