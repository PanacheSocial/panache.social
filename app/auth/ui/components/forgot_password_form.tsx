import React from 'react'
import { cn } from '#common/ui/lib/utils'
import { Button } from '#common/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import { Input } from '#common/ui/components/input'
import { Label } from '#common/ui/components/label'
import useTranslate from '#common/ui/hooks/use_translate'
import { useForm } from '@inertiajs/react'
import { Alert, AlertTitle, AlertDescription } from '#common/ui/components/alert'
import { CircleCheckIcon } from 'lucide-react'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslate('auth')
  const [success, setSuccess] = React.useState(false)

  const  { setData, post, processing, errors }  = useForm({
    email: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/auth/forgot_password', {
      onSuccess: () => setSuccess(true),
      onError: () => setSuccess(false),
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {success ? (
        <Alert>
          <CircleCheckIcon className="stroke-emerald-700 h-5 w-5" />

          <AlertTitle>{t('email_sent_title')}</AlertTitle>
          <AlertDescription>{t('email_sent_description')}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-normal font-serif">
              {t('forgot_password_title')}
            </CardTitle>
            <CardDescription>{t('forgot_password_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('email_label')}</Label>
                  <Input
                    autoComplete="panache-email"
                    id="email"
                    name="email"
                    type="text"
                    placeholder={t('email_placeholder')}
                    required
                    className="pr-20"
                    onChange={(e) => setData('email', e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p> // TODO: Add translation
                  )}
                </div>
                <Button type="submit" className="!w-full" disabled={processing}>
                  {processing ? t('sending') : t('send_reset_link')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
