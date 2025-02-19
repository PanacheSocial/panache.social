import React from 'react'
import SocialLayout from '../components/social_layout'
import Room from '#social/models/room'
import Post from '#social/models/post'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import useTranslate from '#common/ui/hooks/use_translate'
import { PostFeed } from '../components/feeds/feed'
import { Feed } from '#social/types/feed'
import { PageMeta } from '../components/page_meta'
import usePageProps from '#common/ui/hooks/use_page_props'
import { RoomCard } from '#social/ui/components/rooms/room_card'
import { CircleOff, Compass, Squirrel, Telescope, TrendingUp } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { buttonVariants } from '#common/ui/components/button'
import { cn } from '#common/ui/lib/utils'
import { AsciiCyrano } from '../components/ascii_cyrano'

export default function Landing(feed: Feed) {
  const t = useTranslate()
  const { popularRooms } = usePageProps<{ popularRooms: Room[] }>()

  return (
    <PageMeta
      title={t('social.feed')}
      meta={{
        'og:title': 'Panache Social',
      }}
    >
      <PostFeed {...feed} />
      {feed.posts.length === 0 && (
        <div className="md:flex items-center">
          <div className="md:px-8 py-8">
            <AsciiCyrano />
          </div>
          <div className="space-y-4">
            <div className="text-2xl font-semibold">{t('social.empty_here')}</div>
            <div>{t('social.home_feed_no_posts_message')}</div>
            <div className="flex  gap-4">
              <Link href="/rooms" className={cn(buttonVariants({ variant: 'link' }))}>
                <Telescope />
                {t('social.explore')}
              </Link>
              <Link href="/popular" className={cn(buttonVariants({ variant: 'link' }))}>
                <TrendingUp />
                {t('social.popular')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </PageMeta>
  )
}

Landing.layout = SocialLayout
