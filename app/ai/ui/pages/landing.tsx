import React, { FormEvent } from 'react'
import { AiLayout } from '#ai/ui/components/ai_layout'
import { useGetTimeOfDay } from '#ai/ui/hooks/get_time_of_day'
import { useForm } from '@inertiajs/react'
import { MessageInput } from '../components/message_input'

export default function Landing() {
  const getTimeOfDay = useGetTimeOfDay()
  const form = useForm({
    prompt: '',
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    form.post('/ai/chats')
  }

  return (
    <AiLayout>
      <div className="min-h-full flex flex-col space-y-4 items-center justify-center">
        <h1 className="text-center text-3xl sm:text-5xl lg:text-7xl font-serif">
          {getTimeOfDay()}
        </h1>
        <form className="w-full max-w-2xl" onSubmit={handleSubmit}>
          <MessageInput
            value={form.data.prompt}
            onValueChange={(e) => form.setData('prompt', e.target.value)}
          />
        </form>
      </div>
    </AiLayout>
  )
}
