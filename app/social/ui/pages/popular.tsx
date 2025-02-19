import React from 'react'
import SocialLayout from '../components/social_layout'
import useTranslate from '#common/ui/hooks/use_translate'
import { PostFeed } from '../components/feeds/feed'
import { Feed } from '#social/types/feed'
import { router } from '@inertiajs/react'
import { PageMeta } from '../components/page_meta'

export default function Landing(feed: Feed) {
  const t = useTranslate()
  return (
    <PageMeta
      title={t('social.feed')}
      meta={{
        'og:title': 'Panache Social',
        'og:description': 'An open-source everything app',
      }}
    >
      <h1 className="text-3xl font-bold pb-8">{t('social.popular')}</h1>
      <PostFeed {...feed} />
    </PageMeta>
  )
}

Landing.layout = SocialLayout
