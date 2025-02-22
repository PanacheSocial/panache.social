import React from 'react'
import SocialLayout from '../components/social_layout'
import Room from '#social/models/room'
import SearchTabs from '../components/search_tabs'
import { RoomCard } from '../components/rooms/room_card'
import { Alert, AlertTitle, AlertDescription } from '#common/ui/components/alert'
import { SearchX } from 'lucide-react'
import useTranslate from '#common/ui/hooks/use_translate'

export default function Rooms({ roomsList }: { roomsList: Room[] }) {
  const t = useTranslate()
  return (
    <>
      <h1 className="text-3xl font-bold pb-8">{t('social.explore')}</h1>

      <SearchTabs resource="rooms" />

      <div className="grid gap-y-4 pt-4">
        {roomsList.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
        {roomsList.length === 0 ? (
          <Alert>
            <SearchX className="h-5 w-5 stroke-red-700" />
            <AlertTitle>{t('social.no_results_title')}</AlertTitle>
            <AlertDescription>{t('social.no_results_description')}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </>
  )
}

Rooms.layout = SocialLayout
