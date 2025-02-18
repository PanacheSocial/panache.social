'use client'
import useTranslate from '#common/ui/hooks/use_translate'
import type Profile from '#social/models/profile'
import { Camera, CheckIcon, Link, IdCard } from 'lucide-react'
import React from 'react'
import { useRef, useState } from 'react'
import { EditProfileDialog } from './edit_profile_dialog'
import { ImageCropper } from '../image_cropper'
import { router } from '@inertiajs/react'
import { useToast } from '#common/ui/hooks/use_toast'
import { ProfileAvatar } from './profile_avatar'
import useUser from '#common/ui/hooks/use_user'

export function ProfileHeader({ profile }: { profile: Profile }) {
  const t = useTranslate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string>('')
  const { toast } = useToast()
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }
  const user = useUser()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCropperOpen(true)
      URL.createObjectURL(file)
      setSelectedFile(URL.createObjectURL(file))
    }
  }

  async function handleAvatarUpdate(croppedImageUrl: string) {
    /**
     * Fetch the cropped image and convert it to a File object
     */
    const res = await fetch(croppedImageUrl)
    const blob = await res.blob()
    const avatar = new File([blob], 'avatar', { type: blob.type })

    /**
     * Prepare the form data
     */
    const formData = new FormData()
    formData.append('avatar', avatar)

    /**
     * Send the form data to the server
     * using the PATCH method
     */
    router.patch(`/profiles/${profile.id}/avatar`, formData, {
      forceFormData: true,
      headers: { 'Content-Type': 'multipart/form-data' },
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('social.avatar_updated')}</span>
            </div>
          ),
        })
      },
    })
  }

  return (
    <header>
      <ImageCropper
        dialogOpen={cropperOpen}
        setDialogOpen={setCropperOpen}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        title={t('social.update_avatar')}
        callback={handleAvatarUpdate}
      />
      <div className="h-24 bg-[#e3e2d4] rounded-lg border border-sidebar"></div>
      <div className="flex flex-col flex-wrap gap-x-2 justify-center pt-3 px-4 max-w-4xl mx-auto">
        <div className="flex items-start gap-x-4">
          {profile.id === user?.currentProfileId ? (
            <>
              <div
                className="relative -mt-10 cursor-pointer group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleAvatarClick}
              >
                <ProfileAvatar
                  profile={profile}
                  className="h-24 w-24 rounded-3xl border-4 border-white transition-opacity duration-200 ease-in-out group-hover:opacity-90"
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-3xl transition-opacity duration-200 ease-in-out ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Camera className="text-white drop-shadow-md" size={24} />
                  <span className="sr-only">Update avatar</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </>
          ) : (
            <ProfileAvatar
              profile={profile}
              className="-mt-10 h-24 w-24 rounded-3xl border-4 border-white transition-opacity duration-200 ease-in-out group-hover:opacity-90"
            />
          )}
          <div>
            <p className="font-mono font-medium uppercase text-sm">{t('social.profile')}</p>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold">
                {profile.displayName ? profile.displayName : `@${profile.username}`}
              </h2>
              {profile.id === user?.currentProfileId && <EditProfileDialog />}
            </div>
            {profile.displayName && (
              <div className="flex items-center text-lg gap-x-2 text-neutral-600">
                <span>@{profile.username}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm text-neutral-600 border-t pt-4">
          {profile.bio && (
            <div className="flex items-center gap-x-2">
              <IdCard size={16} />
              <p className="whitespace-pre-wrap">
                <span>{profile.bio}</span>
              </p>
            </div>
          )}
          {profile.websiteUrl && (
            <div className="flex items-center gap-x-2">
              <Link size={16} />
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {profile.websiteUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
