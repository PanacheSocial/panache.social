import React from 'react'
import useError from '../hooks/use_error'
import useSuccess from '../hooks/use_success'
import { cn } from '../lib/utils'

export type SuccessProps = {
  successKey: string
} & React.ComponentProps<'p'>

export function Success({ className, successKey, ...props }: SuccessProps) {
  const success = useSuccess(successKey)
  if (success === undefined) {
    return null
  }

  return (
    <p className={cn('text-green-600 text-sm', className)} {...props}>
      {success}
    </p>
  )
}
