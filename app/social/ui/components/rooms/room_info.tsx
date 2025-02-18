import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import usePageProps from '#common/ui/hooks/use_page_props'
import useTranslate from '#common/ui/hooks/use_translate'
import { cn } from '#common/ui/lib/utils'
import Profile from '#social/models/profile'
import Room from '#social/models/room'
import { CalendarIcon, GlobeIcon, Users2Icon } from 'lucide-react'
import React from 'react'
import { Link } from '@inertiajs/react'
import { ProfileAvatar } from '../profiles/profile_avatar'

export function RoomInfo({ header, room }: { room: Room; header?: React.ReactElement }) {
  const t = useTranslate()
  const formatDistanceToNow = useFormatDistanceToNow()
  const { moderatorProfiles } = usePageProps<{ moderatorProfiles?: Profile[] }>()

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

        {moderatorProfiles && moderatorProfiles.length > 0 && (
          <div className="mt-4">
            <hr />
            <div className="mt-4">
              <p className="text-foreground font-medium break-all whitespace-pre-line mb-2">
                {t('social.moderators')}:
              </p>
              <div className="flex flex-wrap gap-2">
                {moderatorProfiles.map((profile) => (
                  <Link
                    key={profile.id}
                    className="flex items-center gap-2 hover:opacity-75 transition-opacity"
                    href={`/profiles/${profile.username}`}
                  >
                    <ProfileAvatar profile={profile} className="h-6 w-6" />
                    <span className="text-xs font-medium hover:text-emerald-900 transition-colors">
                      @{profile.username}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
