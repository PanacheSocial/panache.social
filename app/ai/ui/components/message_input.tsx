import Spinner from '#common/ui/components/spinner'
import useTranslate from '#common/ui/hooks/use_translate'
import { cn } from '#common/ui/lib/utils'
import { ArrowUp } from 'lucide-react'
import React from 'react'

export type MessageInputProps = {
  value: string
  onValueChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading?: boolean
}

export function MessageInput({ value, onValueChange, isLoading }: MessageInputProps) {
  const t = useTranslate()

  return (
    <div className="relative flex w-full">
      <textarea
        className={cn(
          'z-10 w-full pb-8 rounded-sm grow resize-none px-3 pt-2 text-sm border border-neutral-300 shadow-xs placeholder:text-muted-foreground focus-visible:outline-none transition read-only:!ring-0 read-only:!border-neutral-300 focus:border-neutral-500 focus:ring-4 focus:ring-sidebar-accent disabled:cursor-not-allowed disabled:opacity-50'
        )}
        minLength={5}
        placeholder={t('ai.ask_a_question')}
        rows={3}
        value={value}
        onChange={onValueChange}
      ></textarea>

      <div className="absolute right-3 bottom-3 z-20 flex gap-2">
        <button
          type="submit"
          disabled={isLoading || value?.length < 5}
          className={
            'bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white border-transparent p-1.5 rounded-full'
          }
        >
          {isLoading ? <Spinner /> : <ArrowUp className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
