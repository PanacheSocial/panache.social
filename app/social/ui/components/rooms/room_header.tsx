'use client'
import { buttonVariants } from '#common/ui/components/button'
import useTranslate from '#common/ui/hooks/use_translate'
import useUser from '#common/ui/hooks/use_user'
import { cn } from '#common/ui/lib/utils'
import type Room from '#social/models/room'
import { Link } from '@inertiajs/react'
import { PlusCircleIcon } from 'lucide-react'
import { JoinRoomButton } from './join_room_button'
import { RoomLogoUploader } from './room_logo_uploader'
import React from 'react'

export function RoomHeader({ room, canModerate }: { room: Room; canModerate: boolean }) {
  const t = useTranslate()
  const user = useUser()

  return (
    <header>
      <div className="h-24 bg-[#e3e2d4] rounded-lg border border-sidebar"></div>
      <div className="flex flex-wrap gap-x-2 items-center justify-between pt-3 px-4">
        <div className="flex flex-col lg:flex-row items-start gap-y-4 lg:gap-y-0 lg:gap-x-4 lg:w-full">
          <RoomLogoUploader room={room} canEdit={canModerate} />

          <div>
            <p className="font-mono font-medium uppercase text-sm">{t('social.room')}</p>
            <h2 className="text-2xl font-semibold">{room.name}</h2>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-y-0 pt-4 sm:pt-0 ml-auto">
            <Link
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                '!w-full sm:!w-auto',
                !user && '!cursor-not-allowed opacity-50'
              )}
              href={user ? `/create?room=${room.slug}` : ''}
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span>{t('social.create_a_post')}</span>
            </Link>
            <JoinRoomButton />
          </div>
        </div>
      </div>
    </header>
  )
}
