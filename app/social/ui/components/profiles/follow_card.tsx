import React from 'react'
import { Link } from '@inertiajs/react'
import { ProfileAvatar } from './profile_avatar'
import { FollowButton } from './follow_button'
import { useCurrentProfile } from '#common/ui/hooks/use_current_profile'
import Follow from '#social/models/follow'

export function FollowCard({ follow }: { follow: Follow }) {
  const currentProfile = useCurrentProfile()
  const followedProfile = follow.following
  const isOwnProfile = followedProfile.id === currentProfile.id

  const isFollowing = false
  console.log('currentProfile', currentProfile)
  console.log('follow', follow)
  return (
    <div className="flex items-start justify-between p-4">
      <div className="flex items-start gap-x-3">
        <Link href={`/profiles/${follow.follower.username}`}>
          <ProfileAvatar
            profile={follow.follower}
            className="h-10 w-10 hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="flex flex-col space-y-1">
          <div className="flex flex-col">
            <Link
              href={`/profiles/${follow.follower.username}`}
              className="font-medium text-sm hover:text-emerald-600 transition-colors"
            >
              {follow.follower.displayName || follow.follower.username}
            </Link>
            <p className="text-[13px] text-neutral-700">@{follow.follower.username}</p>
          </div>
        </div>
      </div>

      {!isOwnProfile && <FollowButton profile={follow.follower} isFollowing={isFollowing!!} />}
    </div>
  )
}
