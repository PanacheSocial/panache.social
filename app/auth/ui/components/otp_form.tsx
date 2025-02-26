import React from 'react'
import { Button } from '#common/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import { OTPInput } from './otp_input'
import { Link, useForm } from '@inertiajs/react'
import useTranslate from '#common/ui/hooks/use_translate'
import { Error } from '#common/ui/components/error'
import { Success } from '#common/ui/components/success'

export function OTPForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslate('auth')

  const form = useForm({
    verification_code: '',
  })

  const handleOtpChange = (otp: string) => {
    form.setData('verification_code', otp)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post('/auth/otp')
  }

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-normal font-serif">{t('otp_title')}</CardTitle>
        <CardDescription>{t('otp_description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <OTPInput length={6} onChange={handleOtpChange} />
          <Error errorKey="auth" />
          <Success successKey="auth" />
          <Button type="submit" className="!w-full">
            {t('submit')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button className="text-blue-500" onClick={() => form.post('/auth/resend-otp')} variant="link">
            {t('resend_otp')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
