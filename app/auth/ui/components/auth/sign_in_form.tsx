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
import { cn } from '#common/ui/lib/utils'
import { Link } from '@inertiajs/react'

export function SignInForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-normal font-serif">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue using Panache.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    autoComplete="panache-username"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="cyrano.bergerac"
                    required
                    className="pr-20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    @panache.social
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto text-sm text-emerald-700 hover:text-emerald-600 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••••" required />
              </div>
              <Button type="submit" className="!w-full">
                Sign In
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-4">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/sign_up"
                className="underline underline-offset-4 text-emerald-700 hover:text-emerald-600 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-[13px] text-muted-foreground">
        By proceeding, you agree to our
        <br />{' '}
        <Link
          className="text-emerald-700 hover:text-emerald-600 underline transition-colors"
          href="#"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          className="text-emerald-700 hover:text-emerald-600 underline transition-colors"
          href="#"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  )
}
