import { Button } from '#common/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '#common/ui/components/dialog'
import { Input } from '#common/ui/components/input'
import { Textarea } from '#common/ui/components/textarea'
import React from 'react'

export function EmailDialog({
  open,
  setOpen,
  to,
  subject,
  body,
}: {
  open: boolean
  setOpen: (open: boolean) => void

  to: string
  subject: string
  body: string
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Nouveau message</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input type="email" placeholder="À" value={to} onChange={(e) => {}} />
          <Input type="text" placeholder="Objet" value={subject} onChange={(e) => {}} />
          <Textarea className="min-h-[300px]" value={body} onChange={(e) => {}} />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button>Envoyer</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
