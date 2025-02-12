import { buttonVariants } from '#common/ui/components/button'
import useTranslate from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import Room from '#social/models/room'
import { PostCard } from '#social/ui/components/posts/post_card'
import SocialLayout from '#social/ui/components/social_layout'
import { SortBySelect } from '#social/ui/components/sort_by_select'
import { Link } from '@inertiajs/react'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
import { RoomInfo } from '#social/ui/components/rooms/room_info'
import { JoinRoomButton } from '#social/ui/components/rooms/join_room_button'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { cn } from '#common/ui/lib/utils'
import useUser from '#common/ui/hooks/use_user'
import { ProfileAvatar } from '../components/profiles/profile_avatar'
import { RoomLogo } from '../components/rooms/room_logo'

export default function Show({ room, posts }: { room: Room; posts: Post[] }) {
  const formatDistanceToNow = useFormatDistanceToNow()
  const t = useTranslate()
  const user = useUser()
  return (
    <SocialLayout
      title={room.name}
      meta={{
        'description': room.description,
        'og:description': room.description,
        'og:url': `https://panache.so/rooms/${room.slug}`,
      }}
    >
      <header>
        <div className="h-24 bg-[#e3e2d4] rounded-lg border border-sidebar"></div>
        <div className="flex flex-wrap gap-x-2 items-center justify-between pt-3 px-4">
          <div className="flex flex-col lg:flex-row items-start gap-y-4 lg:gap-y-0 lg:gap-x-4 lg:w-full">
            <RoomLogo room={room} className="h-24 w-24 -mt-10 rounded-3xl border-4 border-white" />

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
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-4 lg:gap-x-8 xl:gap-x-12 gap-4 pt-6 px-4 w-full">
        <div className="col-span-3">
          <SortBySelect />

          <div className="pt-4 grid gap-y-4 max-w-full">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                room={room}
                header={
                  <div className="flex items-center gap-2">
                    <Link
                      className="hover:opacity-75 transition-opacity"
                      href={`/profiles/${post.profile.username}`}
                    >
                      <ProfileAvatar profile={post.profile} className="h-8 w-8" />
                    </Link>

                    <div className="flex items-center gap-1 text-[13px]">
                      <Link
                        className="hover:text-emerald-900 transition-colors font-medium"
                        href={`/profiles/${post.profile.username}`}
                      >
                        @{post.profile.username}
                      </Link>

                      <span className="text-muted-foreground">
                        • {formatDistanceToNow(post.createdAt as unknown as string)}
                      </span>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
        <div className="col-span-1 w-full pb-4 sm:pb-0">
          <RoomInfo room={room} />
        </div>
      </div>
    </SocialLayout>
  )
}
