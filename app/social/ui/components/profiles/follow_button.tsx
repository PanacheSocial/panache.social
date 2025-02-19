import { Button } from '#common/ui/components/button'
import usePageProps from '#common/ui/hooks/use_page_props'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import useUser from '#common/ui/hooks/use_user'
import Profile from '#social/models/profile'
import { useForm } from '@inertiajs/react'
import { CheckIcon, UserMinus, UserPlus } from 'lucide-react'
import React from 'react'

export function FollowButton({ profile, isFollowing }: { profile: Profile; isFollowing: boolean }) {
  const user = useUser()
  const { toast } = useToast()
  const followForm = useForm()
  const isOwnProfile = profile.id === user?.currentProfileId
  const t = useTranslate()

  if (!user || isOwnProfile) {
    return null
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    followForm.post(`/profiles/${profile.id}/${isFollowing ? 'unfollow' : 'follow'}`, {
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t(isFollowing ? 'social.unfollow_success' : 'social.follow_success')}</span>
            </div>
          ),
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button
        type="submit"
        variant={isFollowing ? 'secondary' : 'default'}
        size="sm"
        className="flex items-center gap-x-1"
      >
        {isFollowing ? (
          <>
            <UserMinus size={16} />
            {t('social.unfollow')}
          </>
        ) : (
          <>
            <UserPlus size={16} />
            {t('social.follow')}
          </>
        )}
      </Button>
    </form>
  )
}
