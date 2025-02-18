import { Button } from '#common/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#common/ui/components/dialog'
import { Error } from '#common/ui/components/error'
import { Input } from '#common/ui/components/input'
import { Label } from '#common/ui/components/label'
import { Textarea } from '#common/ui/components/textarea'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import useUser from '#common/ui/hooks/use_user'
import { useForm } from '@inertiajs/react'
import { CheckIcon, Pencil } from 'lucide-react'
import React from 'react'

export function EditProfileDialog() {
  const user = useUser()
  const t = useTranslate()
  const form = useForm({
    displayName: user?.currentProfile?.displayName || '',
    username: user?.currentProfile?.username || '',
    bio: user?.currentProfile?.bio || '',
    websiteUrl: user?.currentProfile?.websiteUrl || '',
  })
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.patch(`/profiles/${user?.currentProfile.id}`, {
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('social.profile_updated')}</span>
            </div>
          ),
        })
        setOpen(false)
      },
    })
  }

  if (!user) return null

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <svg
          className="text-emerald-900 hover:text-emerald-700 transition-colors cursor-pointer !h-5 !w-5"
          width={24}
          height={24}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.533 11.15A1.82 1.82 0 0 0 9 12.438V15h2.578c.483 0 .947-.192 1.289-.534l7.6-7.604a1.82 1.82 0 0 0 0-2.577l-.751-.751a1.82 1.82 0 0 0-2.578 0z" />
          <path d="M21 12c0 4.243 0 6.364-1.318 7.682S16.242 21 12 21s-6.364 0-7.682-1.318S3 16.242 3 12s0-6.364 1.318-7.682S7.758 3 12 3" />
        </svg>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('social.edit_profile')}</DialogTitle>
          </DialogHeader>
          <form className="mt-4 grid gap-4" id="edit-profile-form" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="username">{t('auth.username_label')}</Label>
              <Input
                id="username"
                value={form.data.username}
                onChange={(e) =>
                  form.setData('username', e.target.value.toLowerCase().replaceAll(' ', '.'))
                }
                placeholder={t('auth.username_placeholder')}
              />
              <Error errorKey="username" />
            </div>

            <hr />

            <div className="grid gap-2">
              <Label htmlFor="displayName">{t('social.display_name')}</Label>
              <Input
                id="displayName"
                value={form.data.displayName}
                onChange={(e) => form.setData('displayName', e.target.value)}
                placeholder={t('social.display_name_placeholder')}
              />
              <Error errorKey="displayName" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">{t('social.bio')}</Label>
              <Textarea
                id="bio"
                value={form.data.bio}
                onChange={(e) => form.setData('bio', e.target.value)}
                placeholder={t('social.bio_placeholder')}
              />
              <Error errorKey="bio" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="websiteUrl">{t('social.website')}</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={form.data.websiteUrl}
                onChange={(e) => form.setData('websiteUrl', e.target.value)}
                placeholder={t('social.website_placeholder')}
              />
              <Error errorKey="websiteUrl" />
            </div>
          </form>
          <DialogFooter className="mt-4">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" form="edit-profile-form">
              {t('social.save_changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
