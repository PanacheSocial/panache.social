import React from 'react'
import { TabLink, Tabs, TabsList } from '#common/ui/components/tabs'
import useTranslate from '#common/ui/hooks/use_translate'
import usePageProps from '#common/ui/hooks/use_page_props'
import User from '#common/models/user'

export type FollowTabsProps = {
  resource: 'followers' | 'following'
}

export function FollowTabs({ resource }: FollowTabsProps) {
  const t = useTranslate('social')
  const { profile } = usePageProps<{ profile: User }>()

  return (
    <Tabs defaultValue="followers" className="min-w-full">
      <TabsList className=" !rounded-none flex flex-wrap sm:grid w-full h-full sm:grid-cols-2 gap-y-2 sm:gap-y-0 gap-x-4 px-4 py-2">
        <TabLink
          href={`/profiles/${profile.username}/followers`}
          label={t('followers')}
          isActive={resource === 'followers'}
        />
        <TabLink
          href={`/profiles/${profile.username}/following`}
          label={t('following')}
          isActive={resource === 'following'}
        />
      </TabsList>
    </Tabs>
  )
}
