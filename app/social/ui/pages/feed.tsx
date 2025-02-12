import React from 'react'
import SocialLayout from '../components/social_layout'
import { SortBySelect } from '../components/sort_by_select'
import Room from '#social/models/room'
import { PostCard } from '../components/posts/post_card'
import Post from '#social/models/post'
import { Link } from '@inertiajs/react'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import useTranslate from '#common/ui/hooks/use_translate'
import { RoomLogo } from '../components/rooms/room_logo'

export default function Landing({ posts }: { room: Room; posts: Post[] }) {
  const formatDistanceToNow = useFormatDistanceToNow()
  const t = useTranslate()
  return (
    <SocialLayout
      title={t('social.feed')}
      meta={{
        'og:title': 'Panache Social',
      }}
    >
      <div className="grid sm:grid-cols-3">
        <div className="col-span-2">
          <SortBySelect />
        </div>
      </div>
      <div className="pt-4 grid sm:grid-cols-3 gap-y-4">
        {posts.map((post) => (
          <div className="col-span-2" key={post.id}>
            <PostCard
              post={post}
              room={post.room}
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      className="hover:opacity-75 transition-opacity"
                      href={`/rooms/${post.room.slug}`}
                    >
                      <RoomLogo room={post.room} className="h-8 w-8" />
                    </Link>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-[13px]">
                        <Link
                          className="font-medium hover:text-emerald-600 transition-colors"
                          href={`/rooms/${post.room.slug}`}
                        >
                          {post.room.name}
                        </Link>
                        <span className="text-muted-foreground">
                          • {formatDistanceToNow(post.createdAt as unknown as string)}
                        </span>
                      </div>

                      <div className="flex">
                        <Link
                          className="text-xs text-muted-foreground hover:text-emerald-800 transition-colors"
                          href={`/profiles/${post.profile.username}`}
                        >
                          @{post.profile.username}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        ))}
      </div>
    </SocialLayout>
  )
}
