import React from 'react'
import { AiLayout } from '#ai/ui/components/ai_layout'
import { MessageInput } from '../components/message_input'
import { useChat } from 'ai/react'
import type { UIMessage } from '@ai-sdk/ui-utils'
import Chat from '#ai/models/chat'
import { Markdown } from '../components/markdown'
import { motion } from 'framer-motion'
import { BotIcon, UserIcon } from 'lucide-react'
import { EmailDialog } from '../components/email_dialog'
import { useFlashMessages } from '#common/ui/hooks/use_flash_messages'

export default function ChatPage({ chat }: { chat: Chat }) {
  const [loaded, setLoaded] = React.useState(false)
  const flashMessages = useFlashMessages()
  const { messages, input, handleInputChange, setInput, handleSubmit, isLoading } = useChat({
    api: `/ai/chats/${chat.id}/chat`,
  })
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (flashMessages) {
      setLoaded(true)
    }
  }, [flashMessages])

  React.useEffect(() => {
    if (loaded && flashMessages['prompt'] && formRef.current) {
      setInput(flashMessages['prompt'])
      formRef.current?.submit()
    }
  }, [loaded])

  return (
    <AiLayout>
      <div className="min-h-full flex flex-col space-y-4 items-center justify-between">
        <div className="w-full max-w-xl min-h-full flex flex-col gap-2 items-center">
          {[...chat.messages, ...messages].map((message, index) => (
            <MessageCard key={index} message={message as UIMessage} />
          ))}
        </div>

        <form className="w-full max-w-xl" onSubmit={handleSubmit} ref={formRef}>
          <MessageInput value={input} onValueChange={handleInputChange} isLoading={isLoading} />
        </form>
      </div>
    </AiLayout>
  )
}

function MessageCard({ message }: { message: UIMessage }) {
  return (
    <>
      <motion.div
        className={`flex flex-row gap-2 px-4 w-full md:px-0`}
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
      <Tool message={message} />
    </>
  )
}

function Tool({ message }: { message: UIMessage }) {
  return message.parts?.map((part) => {
    if (part.type === 'tool-invocation') {
      const { toolName, toolCallId, state } = part.toolInvocation

      if (state === 'result') {
        if (toolName === 'draftEmail') {
          const { result } = part.toolInvocation
          return (
            <div key={toolCallId}>
              <EmailDialogTool to={result.to} subject={result.subject} body={result.body} />
            </div>
          )
        }
      }
      return <div key={toolCallId}>{toolName === 'draftEmail' ? <div>Loading...</div> : null}</div>
    }
  })
}

function EmailDialogTool({ to, subject, body }: { to: string; subject: string; body: string }) {
  const [open, setOpen] = React.useState(true)
  return (
    <div>
      <EmailDialog open={open} setOpen={setOpen} to={to} subject={subject} body={body} />
    </div>
  )
}
