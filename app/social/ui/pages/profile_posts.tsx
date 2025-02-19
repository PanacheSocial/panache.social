import React from 'react'
import useTranslate from '#common/ui/hooks/use_translate'
import { PostCard } from '#social/ui/components/posts/post_card'
import { Link } from '@inertiajs/react'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { ProfileTabs } from '../components/profiles/profile_tabs'
import { ProfileHeader } from '../components/profiles/profile_header'
import Profile from '#social/models/profile'
import { RoomLogo } from '../components/rooms/room_logo'
import { ProfileAvatar } from '../components/profiles/profile_avatar'
import { PageMeta } from '../components/page_meta'
import SocialLayout from '../components/social_layout'

export default function ProfilePosts({ profile }: { profile: Profile }) {
  const t = useTranslate()
  const formatDistanceToNow = useFormatDistanceToNow()

  return (
    <PageMeta title={`${profile.username} - ${t('social.posts')}`}>
      <div className="space-y-8">
        <ProfileHeader />
        <ProfileTabs resource="posts" />

        <div className="gap-y-4 flex flex-col max-w-4xl mx-auto">
          {profile.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              room={post.room}
              header={
                post.room ? (
                  <div className="flex items-start gap-2">
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
                      </div>

                      <p className="text-muted-foreground text-xs">
                        <span className="text-black font-medium">@{profile.username}</span>{' '}
                        {t('social.posted')}{' '}
                        {formatDistanceToNow(post.createdAt as unknown as string)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <Link
                      className="hover:opacity-75 transition-opacity"
                      href={`/profiles/${profile.username}`}
                    >
                      <ProfileAvatar profile={profile} className="h-8 w-8" />
                    </Link>
                    <div className="text-muted-foreground text-xs flex flex-col">
                      <Link
                        className="text-black font-medium hover:text-emerald-600 transition-colors"
                        href={`/profiles/${profile.username}`}
                      >
                        @{profile.username}
                      </Link>{' '}
                      <p>
                        {t('social.posted')}{' '}
                        {formatDistanceToNow(post.createdAt as unknown as string)}
                      </p>
                    </div>
                  </div>
                )
              }
            />
          ))}
        </div>
      </div>
    </PageMeta>
  )
}

ProfilePosts.layout = SocialLayout
