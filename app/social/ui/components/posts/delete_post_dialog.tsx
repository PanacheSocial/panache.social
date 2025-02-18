import { Button } from '#common/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#common/ui/components/dialog'
import useParams from '#common/ui/hooks/use_params'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import { useForm } from '@inertiajs/react'
import { CheckIcon } from 'lucide-react'
import React from 'react'

export function DeletePostDialog({
  post,
  open,
  setOpen,
}: {
  post: Post
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const t = useTranslate('social')
  const form = useForm({})
  const { toast } = useToast()

  const handleDelete = () => {
    form.delete(`/posts/${post.id}`, {
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('post_deleted')}</span>
            </div>
          ),
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('delete_post')}</DialogTitle>
          <DialogDescription>{t('delete_post_description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="danger" onClick={handleDelete}>
            {t('delete_post')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
