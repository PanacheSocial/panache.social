import React from 'react'
import { Link } from '@inertiajs/react'
import useTranslate from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import { JoinRoomButton } from '#social/ui/components/rooms/join_room_button'
import { PostActions } from '#social/ui/components/posts/post_actions'
import { PostActionsDropdown } from '#social/ui/components/posts/post_actions_dropdown'
import { RoomInfo } from '#social/ui/components/rooms/room_info'
import SocialLayout from '#social/ui/components/social_layout'
import CreateCommentForm from '../components/comments/create_comment_form'
import { CommentCard } from '../components/comments/comment_card'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { SortCommentSelect } from '../components/comments/sort_comment_select'
import { ImagePreview } from '#common/ui/components/image_preview'
import { LinkPreview } from '../components/posts/link_preview'
import { ProfileAvatar } from '../components/profiles/profile_avatar'
import { RoomLogo } from '../components/rooms/room_logo'
import { YouTubeEmbed } from '../components/posts/youtube_embed'

export default function Show({ post }: { post: Post }) {
  const t = useTranslate()
  const formatDistanceToNow = useFormatDistanceToNow()

  // Check if the link is from YouTube
  const isYouTubeLink = post.link?.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)

  return (
    <SocialLayout
      title={post.title}
      meta={{
        'description': post.text || post.title,
        'og:description': post.text || undefined,
        'og:image': post.image || post.ogImage || undefined,
        'og:url': `https://panache.so/posts/${post.id}`,
      }}
    >
      <div className="flex flex-col-reverse sm:grid sm:grid-cols-4 gap-y-4 sm:gap-y-0 sm:gap-x-8">
        <div className="col-span-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              {post.room ? (
                <Link
                  className="hover:opacity-75 transition-opacity"
                  href={`/rooms/${post.room.slug}`}
                >
                  <RoomLogo room={post.room} className="h-9 w-9" />
                </Link>
              ) : (
                <Link
                  className="hover:opacity-75 transition-opacity"
                  href={`/profiles/${post.profile.username}`}
                >
                  <ProfileAvatar profile={post.profile} className="h-9 w-9" />
                </Link>
              )}

              <div className="flex items-start justify-start flex-col">
                {post.room ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm">
                      <Link
                        className="font-medium text-emerald-950 hover:text-emerald-700 transition-colors"
                        href={`/rooms/${post.room.slug}`}
                      >
                        {post.room.name}
                      </Link>
                      <span className="text-muted-foreground text-xs">
                        • {formatDistanceToNow(post.createdAt as unknown as string)}
                      </span>
                    </div>

                    <Link
                      className="text-xs text-muted-foreground hover:text-emerald-800 transition-colors"
                      href={`/profiles/${post.profile.username}`}
                    >
                      @{post.profile.username}
                    </Link>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs flex flex-col">
                    <Link
                      className="text-sm font-medium text-foreground hover:text-emerald-800 transition-colors"
                      href={`/profiles/${post.profile.username}`}
                    >
                      @{post.profile.username}
                    </Link>{' '}
                    {t('social.posted')} {formatDistanceToNow(post.createdAt as unknown as string)}
                  </p>
                )}
              </div>
            </div>

            <PostActionsDropdown post={post} />
          </div>

          <h2 className="font-semibold text-xl pt-4 lg:pr-8">{post.title}</h2>

          <div className="pt-2">
            {post.link && (
              <>
                {isYouTubeLink ? (
                  <YouTubeEmbed url={post.link} />
                ) : post.ogImage ? (
                  <LinkPreview
                    image={{ src: post.ogImage, alt: post.title + "'s Image" }}
                    title={post.title}
                    domain={post.link ? new URL(post.link).hostname : undefined}
                    link={post.link}
                  />
                ) : (
                  <a
                    className="transition-colors text-sm text-emerald-800 hover:text-emerald-600 break-all"
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {post.link}
                  </a>
                )}
              </>
            )}

            {post.text && (
              <p className="prose pt-2 text-sm whitespace-pre-line">
                {post.text}
                <br />
              </p>
            )}

            {post.image && (
              <ImagePreview image={{ src: post.image, alt: post.title + "'s Image" }} />
            )}
          </div>

          <div className="pt-2">
            <PostActions post={post} />
          </div>

          <section className="mt-6 pt-6 space-y-4 border-t">
            <div className="space-y-2">
              <h3 className="font-medium">{t('social.comments')}</h3>
              <CreateCommentForm post={post} />
            </div>

            <SortCommentSelect />

            {post.comments.map((comment) => (
              <CommentCard
                header={
                  <div className="flex items-center gap-2">
                    <Link
                      className="hover:opacity-75 transition-opacity"
                      href={`/profiles/${comment.profile.username}`}
                    >
                      <ProfileAvatar profile={comment.profile} className="h-6 w-6" />
                    </Link>

                    <div className="flex items-center gap-1 text-[13px]">
                      <Link
                        className="hover:text-emerald-900 transition-colors font-medium"
                        href={`/profiles/${comment.profile.username}`}
                      >
                        @{comment.profile.username}
                      </Link>
                      <span className="text-muted-foreground">
                        • {formatDistanceToNow(comment.createdAt as unknown as string)}
                      </span>
                    </div>
                  </div>
                }
                key={comment.id}
                post={post}
                comment={comment}
              />
            ))}
          </section>
        </div>

        {post.room ? (
          <div className="col-span-1 w-full">
            <RoomInfo
              header={
                <header className="flex flex-wrap items-center justify-between gap-y-2 sm:gap-y-0 sm:gap-x-2">
                  <p className="truncate font-medium text-lg">{post.room.name}</p>
                  <JoinRoomButton />
                </header>
              }
              room={post.room}
            />
          </div>
        ) : null}
      </div>
    </SocialLayout>
  )
}
