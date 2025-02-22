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
import { Link, useForm } from '@inertiajs/react'
import useTranslate from '#common/ui/hooks/use_translate'
import { Error } from '#common/ui/components/error'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#common/ui/components/select'

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslate()
  const form = useForm({
    gender: 'male',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post('/auth/sign_up')
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-normal font-serif">
            {t('auth.sign_up_title')}
          </CardTitle>
          <CardDescription>{t('auth.sign_up_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5">
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <Select
                  value={form.data.gender}
                  onValueChange={(value) => form.setData('gender', value)}
                >
                  <SelectTrigger className="!w-auto min-w-20">
                    <SelectValue placeholder={t('common.gender')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('common.gender')}</SelectLabel>
                      <SelectItem value="female">{t('common.female')}</SelectItem>
                      <SelectItem value="male">{t('common.male')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="grid sm:grid-cols-2 gap-2 mt-2 sm:mt-O">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">{t('auth.first_name_label')}</Label>
                    <Input
                      autoComplete="panache-firstname"
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Cyrano"
                      required
                      value={form.data.firstName}
                      onChange={(e) => form.setData('firstName', e.target.value)}
                    />
                    <Error errorKey="firstName" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">{t('auth.last_name_label')}</Label>
                    <Input
                      autoComplete="panache-lastName"
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="de Bergerac"
                      required
                      value={form.data.lastName}
                      onChange={(e) => form.setData('lastName', e.target.value)}
                    />
                    <Error errorKey="lastName" />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">{t('auth.username_label')}</Label>
                <div className="relative">
                  <Input
                    autoComplete="panache-username"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="cyrano.bergerac"
                    required
                    className="pr-20"
                    value={form.data.username}
                    onChange={(e) =>
                      form.setData('username', e.target.value.toLowerCase().replaceAll(' ', '.'))
                    }
                  />
                  <span className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    @panache.social
                  </span>
                </div>
                <Error errorKey="username" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('auth.email_label')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('auth.email_placeholder')}
                  value={form.data.email}
                  onChange={(e) => form.setData('email', e.target.value.toLowerCase())}
                />
                <Error errorKey="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('auth.password_label')}</Label>
                <Input
                  autoComplete="panache-password"
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  required
                  value={form.data.password}
                  onChange={(e) => form.setData('password', e.target.value)}
                />
                <Error errorKey="password" />
              </div>
              <Button type="submit" className="!w-full">
                {t('auth.sign_up')}
              </Button>

              {/* @ts-ignore */}
              {import.meta.env.VITE_USER_NODE_ENV === 'development' && (
                <Button
                  type="button"
                  variant="warning"
                  className="!w-full"
                  onClick={() => {
                    form.setData({
                      firstName: 'Cyrano',
                      lastName: 'de Bergerac',
                      username: 'cyrano.bergerac',
                      email: 'cyrano.bergerac@exemple.fr',
                      password: 'cyrano.bergerac@exemple.fr',
                      gender: 'male',
                    })
                  }}
                >
                  Fill Development Values
                </Button>
              )}
            </div>
            <div className="text-center text-sm text-muted-foreground pt-4">
              {t('auth.existing_account_prompt')}{' '}
              <Link
                href="/auth/sign_in"
                className="underline underline-offset-4 text-emerald-700 hover:text-emerald-600 transition-colors"
              >
                {t('auth.sign_in')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
