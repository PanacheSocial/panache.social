import React from 'react'
import type Post from '#social/models/post'
import { Card } from '#common/ui/components/card'
import type Room from '#social/models/room'
import { Link } from '@inertiajs/react'
import { PostActions } from './post_actions'
import { ImagePreview } from '#common/ui/components/image_preview'
import { LinkPreview } from './link_preview'
import { cn } from '#common/ui/lib/utils'
import { YouTubeEmbed } from './youtube_embed'

interface PostCardProps {
  header?: React.ReactElement
  room: Room
  post: Post
}

export function PostCard({ header, post }: PostCardProps) {
  const [cancelHover, setCancelHover] = React.useState(false)

  // Check if the link is from YouTube
  const isYouTubeLink = post.link?.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)
  return (
    <Link href={`/posts/${post.id}`} as="div" className="cursor-pointer">
      <Card className={cn(!cancelHover && 'hover:bg-accent', 'transition-colors max-w-[80vw]')}>
        <div className="p-4">
          {header}

          {/* Content */}
          <div className="pt-2 flex flex-col space-y-1">
            <h2 className="font-medium">{post.title}</h2>

            {/* YouTube Embed */}
            {post.link && isYouTubeLink && (
              <YouTubeEmbed url={post.link} setHovered={setCancelHover} />
            )}

            {/* Regular Link */}
            {post.link && !isYouTubeLink && !post.ogImage && (
              <a
                href={post.link}
                className="transition-colors text-sm text-emerald-800 hover:text-emerald-600 truncate break-all w-min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {post.link.length > 60 ? `${post.link.slice(0, 60)}...` : post.link}
              </a>
            )}

            {/* Link Preview */}
            {post.link && !isYouTubeLink && post.ogImage && (
              <LinkPreview
                image={{ src: post.ogImage, alt: post.title + "'s Image" }}
                title={post.title}
                domain={post.link ? new URL(post.link).hostname : undefined}
                link={post.link}
                small
                setHovered={setCancelHover}
              />
            )}

            {post.text && (
              <p className="text-sm break-all">
                {post.text.length > 100 ? `${post.text.slice(0, 100)}...` : post.text}
              </p>
            )}

            {/* Image */}
            {post.image && (
              <div className="flex">
                <ImagePreview
                  image={{ src: post.image, alt: post.title + "'s Image" }}
                  setHovered={setCancelHover}
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <PostActions post={post} />
          </div>
        </div>
      </Card>
    </Link>
  )
}
