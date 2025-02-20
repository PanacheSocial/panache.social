import { Button } from '#common/ui/components/button'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import { cn } from '#common/ui/lib/utils'
import Post from '#social/models/post'
import Comment from '#social/models/comment'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '#common/ui/components/dropdown-menu'
import { CheckIcon, ClipboardCopyIcon, Heart, MessageSquare, Share2 } from 'lucide-react'
import React, { FormEvent, useState } from 'react'
import CreateCommentForm from './create_comment_form'
import useUser from '#common/ui/hooks/use_user'
import useParams from '#common/ui/hooks/use_params'

export type CommentActionsProps = {
  post: Post
  comment: Comment
  hideReply?: boolean
}

export function CommentActions({ post, comment, hideReply }: CommentActionsProps) {
  const [likesCount, setLikesCount] = useState(comment.likesCount)
  const [userLikes, setUserLikes] = useState(comment.likes?.length > 0 || false)
  const [reply, setReply] = useState(false)
  const t = useTranslate('social')
  const { toast } = useToast()
  const user = useUser()
  const params = useParams()

  const handleClickLike = async (e: FormEvent) => {
    e.preventDefault()

    if (userLikes) {
      /**
       * Handle dislike.
       */
      await fetch(`/comments/${comment.id}/unlike`, {
        method: 'POST',
        credentials: 'include',
      })
      setLikesCount((likesCount) => likesCount - 1)
      setUserLikes(false)
    } else {
      /**
       * Handle like.
       */
      await fetch(`/comments/${comment.id}/like`, {
        method: 'POST',
        credentials: 'include',
      })
      setLikesCount((likesCount) => likesCount + 1)
      setUserLikes(true)
      e.stopPropagation()
    }
  }

  const handleCopyLink = (e: FormEvent) => {
    navigator.clipboard.writeText(`https://panache.social/posts/${post.id}#comment-${comment.id}`)
    toast({
      description: (
        <div className="flex items-center space-x-2">
          <CheckIcon className="text-emerald-700 h-4 w-4" />
          <span>{t('link_copied')}</span>
        </div>
      ),
    })
    e.stopPropagation()
  }

  return (
    <>
      <div className="flex flex-wrap pt-1 gap-y-2 sm:gap-y-1 gap-x-1 text-xs">
        <Button
          variant="outline"
          className={cn('!h-8', userLikes && 'text-red-800')}
          onClick={handleClickLike}
          disabled={!user}
        >
          <Heart className="h-4 w-4" strokeWidth={2.5} />
          <span className="font-semibold text-xs">{likesCount}</span>
        </Button>

        {!comment.commentId && !hideReply ? (
          <Button variant="outline" className="!h-8" onClick={() => setReply((value) => !value)}>
            <MessageSquare className="h-4 w-4" strokeWidth={2} />
            {t('reply')}
          </Button>
        ) : null}

        {!comment.commentId ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="!text-sm !h-8">
                <Share2 strokeWidth={2} className="h-4 w-4" />
                <span>{t('share')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleCopyLink}>
                <ClipboardCopyIcon className="h-4 w-4" />
                <span>{t('copy_link')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      {reply ? (
        <div className="pt-4">
          <CreateCommentForm post={post} comment={comment} onCancel={() => setReply(false)} />
        </div>
      ) : null}
    </>
  )
}
