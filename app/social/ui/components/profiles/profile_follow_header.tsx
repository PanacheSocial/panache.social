import { buttonVariants } from '#common/ui/components/button'
import { cn } from '#common/ui/lib/utils'
import { Link } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { FollowTabs } from './follow_tabs'
import Profile from '#social/models/profile'

export function ProfileFollowHeader({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col border-b">
      <div className="flex items-center px-4 py-2 gap-x-8">
        <Link
          href={`/profiles/${profile.username}`}
          className={cn(buttonVariants({ variant: 'ghost' }))}
        >
          <ArrowLeft className="h-5 w-5 text-neutral-600 hover:text-neutral-900 transition-colors" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">{profile.displayName || profile.username}</h1>
          <span className="text-sm text-neutral-600">@{profile.username}</span>
        </div>
      </div>
    </div>
  )
}
