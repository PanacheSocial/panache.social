import React from 'react'
import useTranslate from '#common/ui/hooks/use_translate'
import SocialLayout from '#social/ui/components/social_layout'
import { Link } from '@inertiajs/react'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { ProfileTabs } from '../components/profiles/profile_tabs'
import { ProfileHeader } from '../components/profiles/profile_header'
import { CommentCard } from '../components/comments/comment_card'
import Profile from '#social/models/profile'
import { RoomLogo } from '../components/rooms/room_logo'

export default function ProfileComments({ profile }: { profile: Profile }) {
  const t = useTranslate()
  const formatDistanceToNow = useFormatDistanceToNow()

  return (
    <SocialLayout title={`${profile.username} - ${t('social.comments')}`}>
      <div className="space-y-8">
        <ProfileHeader />
        <ProfileTabs resource="comments" />
        <div className="gap-y-4 flex flex-col max-w-4xl mx-auto">
          {profile.comments.map((comment) => (
            <div key={comment.id}>
              <CommentCard
                post={comment.post}
                comment={comment}
                hideReply
                header={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link
                        className="hover:opacity-75 transition-opacity"
                        href={`/rooms/${comment.post.room.slug}`}
                      >
                        <RoomLogo room={comment.post.room} className="h-8 w-8" />
                      </Link>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-[13px]">
                          <Link
                            className="font-medium hover:text-emerald-600 transition-colors"
                            href={`/rooms/${comment.post.room.slug}`}
                          >
                            {comment.post.room.name}
                          </Link>
                          <span>•</span>
                          <Link
                            className="font-medium text-muted-foreground hover:text-emerald-600 transition-colors"
                            href={`/posts/${comment.post.id}`}
                          >
                            {comment.post.title.slice(0, 30)}
                          </Link>
                        </div>

                        <p className="text-muted-foreground text-xs">
                          <span className="text-black font-medium">@{profile.username}</span>{' '}
                          {t('social.commented')}{' '}
                          {formatDistanceToNow(comment.createdAt as unknown as string)}
                        </p>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </SocialLayout>
  )
}
