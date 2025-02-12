import React from 'react'
import { AiLayout } from '#ai/ui/components/ai_layout'
import { MessageInput } from '../components/message_input'
import { useChat } from 'ai/react'
import Chat from '#ai/models/chat'
import { Markdown } from '../components/markdown'
import { motion } from 'framer-motion'
import { BotIcon, UserIcon } from 'lucide-react'

export default function ChatPage({ chat }: { chat: Chat }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/ai/chats/${chat.id}/chat`,
  })

  return (
    <AiLayout>
      <div className="min-h-full flex flex-col space-y-4 items-center justify-between">
        <div className="w-full max-w-xl min-h-full flex flex-col gap-2 items-center">
          {[...chat.messages, ...messages].map((message, index) => (
            <motion.div
              key={index}
              className={`flex flex-row gap-2 px-4 w-full md:px-0 ${index === 0 ? 'pt-20' : ''}`}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="h-5 flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                {message.role === 'assistant' ? <BotIcon /> : <UserIcon />}
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-zinc-800 text-sm flex flex-col gap-4">
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <form className="w-full max-w-xl" onSubmit={handleSubmit}>
          <MessageInput value={input} onValueChange={handleInputChange} />
        </form>
      </div>
    </AiLayout>
  )
}
