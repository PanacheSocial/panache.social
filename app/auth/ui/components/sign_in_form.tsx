import React from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#common/ui/components/tabs'

export function SignInForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslate('auth')

  const form = useForm({
    email: '',
    username: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post('/auth/sign_in')
  }

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-normal font-serif">{t('sign_in_title')}</CardTitle>
        <CardDescription>{t('sign_in_description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Tabs defaultValue="username">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="username">{t('username_label')}</TabsTrigger>
              <TabsTrigger value="email">{t('email_label')}</TabsTrigger>
            </TabsList>

            {/* Username Field */}
            <TabsContent className="grid gap-2 pt-4" value="username">
              <Label htmlFor="username">{t('username_label')}</Label>
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
                  onChange={(e) => form.setData('username', e.target.value.toLowerCase())}
                />
                <span className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  @panache.social
                </span>
              </div>
            </TabsContent>

            {/* Email address field */}
            <TabsContent className="grid gap-2 pt-4" value="email">
              <Label htmlFor="email">{t('email_label')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('email_placeholder')}
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value.toLowerCase())}
              />
            </TabsContent>
          </Tabs>

          {/* Password Field */}
          <div className="grid gap-2">
            {/* <div className="flex items-center">
              <Label htmlFor="password">{t('password_label')}</Label>
              <Link
                href="/auth/forgot_password"
                className="ml-auto text-sm text-emerald-700 hover:text-emerald-600 transition-colors underline underline-offset-4"
              >
                {t('forgot_password')}
              </Link>
            </div> */}
            <Input
              id="password"
              type="password"
              placeholder="••••••••••"
              required
              value={form.data.password}
              onChange={(e) => form.setData('password', e.target.value)}
            />
          </div>

          <Error errorKey="auth" />

          <Button type="submit" className="!w-full">
            {t('sign_in')}
          </Button>

          {/* @ts-ignore */}
          {import.meta.env.VITE_USER_NODE_ENV === 'development' && (
            <Button
              type="button"
              variant="warning"
              className="!w-full"
              onClick={() => {
                form.setData({
                  email: '',
                  username: 'cyrano.bergerac',
                  password: 'cyrano.bergerac@exemple.fr',
                })
              }}
            >
              Fill Development Values
            </Button>
          )}
        </form>

        <div className="text-center text-sm text-muted-foreground pt-4">
          {t('no_account_prompt')}{' '}
          <Link
            href="/auth/sign_up"
            className="underline underline-offset-4 text-emerald-700 hover:text-emerald-600 transition-colors"
          >
            {t('sign_up')}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
