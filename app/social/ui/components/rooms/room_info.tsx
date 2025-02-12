import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import useTranslate from '#common/ui/hooks/use_translate'
import { cn } from '#common/ui/lib/utils'
import Room from '#social/models/room'
import { CalendarIcon, GlobeIcon, Users2Icon } from 'lucide-react'
import React from 'react'

export function RoomInfo({ header, room }: { room: Room; header?: React.ReactElement }) {
  const t = useTranslate()
  const formatDistanceToNow = useFormatDistanceToNow()

  return (
    <div className="w-full flex flex-col justify-between rounded-lg bg-[#f0eee6]/50 border p-3 text-sm min-h-32">
      {header}

      <p
        className={cn(
          'text-foreground font-medium break-all whitespace-pre-line',
          header && 'pt-4'
        )}
      >
        {room.description}
      </p>

      <div>
        <div className="flex gap-x-1 items-start text-muted-foreground pt-2">
          <GlobeIcon className="h-4 w-4" />
          <span>Public</span>
        </div>

        <div className="flex gap-x-1 items-start text-muted-foreground pt-2">
          <Users2Icon className="h-4 w-4" />
          <span>
            {room.membersCount ? room.membersCount : '0'}{' '}
            {room.membersCount > 1 ? t('social.members') : t('social.member')}
          </span>
        </div>

        <div className="flex gap-x-1 items-start text-muted-foreground pt-2">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {t('common.created')} {formatDistanceToNow(room.createdAt as unknown as string)}
          </span>
        </div>
      </div>
    </div>
  )
}
