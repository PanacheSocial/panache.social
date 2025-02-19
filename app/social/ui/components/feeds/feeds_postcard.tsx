import Post from '#social/models/post'
import React from 'react'
import { PostCard } from '../posts/post_card'
import { RoomLogo } from '../rooms/room_logo'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { Link } from '@inertiajs/react'

export const FeedPostCard = ({ post }: { post: Post }) => {
  const formatDistanceToNow = useFormatDistanceToNow()

  return (
    <PostCard
      post={post}
      room={post.room}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="hover:opacity-75 transition-opacity" href={`/rooms/${post.room.slug}`}>
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
  )
}
