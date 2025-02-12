'use client'
import { Camera, CheckIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { ImageCropper } from '../image_cropper'
import { router } from '@inertiajs/react'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import { RoomLogo } from './room_logo'
import type Room from '#social/models/room'

export function RoomLogoUploader({ room, canEdit }: { room: Room; canEdit: boolean }) {
  const t = useTranslate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string>('')
  const { toast } = useToast()

  const handleLogoClick = () => {
    if (canEdit) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCropperOpen(true)
      setSelectedFile(URL.createObjectURL(file))
    }
  }

  async function handleLogoUpdate(croppedImageUrl: string) {
    const res = await fetch(croppedImageUrl)
    const blob = await res.blob()
    const logo = new File([blob], 'logo', { type: blob.type })

    const formData = new FormData()
    formData.append('logo', logo)

    router.patch(`/rooms/${room.slug}/logo`, formData, {
      forceFormData: true,
      headers: { 'Content-Type': 'multipart/form-data' },
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('social.logo_updated')}</span>
            </div>
          ),
        })
      },
    })
  }

  if (!canEdit) {
    return <RoomLogo room={room} className="h-24 w-24 -mt-10 rounded-3xl border-4 border-white" />
  }

  return (
    <>
      <ImageCropper
        dialogOpen={cropperOpen}
        setDialogOpen={setCropperOpen}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        title={t('social.update_logo')}
        callback={handleLogoUpdate}
      />
      <div
        className="relative -mt-10 cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleLogoClick}
      >
        <RoomLogo
          room={room}
          className="h-24 w-24 rounded-3xl border-4 border-white transition-opacity duration-200 ease-in-out group-hover:opacity-90"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-3xl transition-opacity duration-200 ease-in-out ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Camera className="text-white drop-shadow-md" size={24} />
          <span className="sr-only">Update logo</span>
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
  )
}
