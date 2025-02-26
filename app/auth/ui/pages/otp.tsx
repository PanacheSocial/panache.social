import React from 'react'
import { AuthLayout } from '#auth/ui/components/auth_layout'
import { OTPForm } from '#auth/ui/components/otp_form'
import { Head } from '@inertiajs/react'
import useTranslate from '#common/ui/hooks/use_translate'

export default function OTPPage() {
  const t = useTranslate('auth')

  return (
    <>
      <Head title={t('otp_title')} />
      <AuthLayout>
        <OTPForm />
      </AuthLayout>
    </>
  )
}
