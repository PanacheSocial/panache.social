import Post from '#social/models/post'
import Room from '#social/models/room'
import { PostCard } from '#social/ui/components/posts/post_card'
import { SortBySelect } from '#social/ui/components/sort_by_select'
import { Link } from '@inertiajs/react'
import React from 'react'
import { RoomInfo } from '#social/ui/components/rooms/room_info'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { ProfileAvatar } from '../components/profiles/profile_avatar'
import { RoomHeader } from '../components/rooms/room_header'
import { PageMeta } from '../components/page_meta'
import SocialLayout from '../components/social_layout'

export default function Show({
  room,
  posts,
  canModerate,
}: {
  room: Room
  posts: Post[]
  canModerate: boolean
}) {
  const formatDistanceToNow = useFormatDistanceToNow()
  return (
    <PageMeta
      title={room.name}
      meta={{
        'description': room.description,
        'og:description': room.description,
        'og:url': `https://panache.so/rooms/${room.slug}`,
      }}
    >
      <RoomHeader room={room} canModerate={canModerate} />

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
    </PageMeta>
  )
}

Show.layout = SocialLayout
