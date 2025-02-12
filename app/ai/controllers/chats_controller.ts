import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'
import { Get, Middleware, Post } from '@softwarecitadel/girouette'
import { streamText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import env from '#start/env'
import { Readable } from 'node:stream'
import Message from '#ai/models/message'
import MessageGenerated from '#ai/events/message_generated'
import { cuid } from '@adonisjs/core/helpers'

export default class ChatsController {
  @Middleware(middleware.auth())
  @Get('/ai', 'ai.landing')
  async landing({ auth, inertia }: HttpContext) {
    const projects = await auth.user!.related('projects').query().orderBy('created_at', 'desc')
    const chats = await auth.user!.related('chats').query().orderBy('created_at', 'desc')
    return inertia.render('ai/landing', { projects, chats })
  }

  @Middleware(middleware.auth())
  @Post('/ai/chats', 'ai.chats.store')
  async store({ auth, request, response }: HttpContext) {
    const chat = await auth.user!.related('chats').create({})
    await chat.related('messages').create({ content: request.input('prompt'), role: 'user' })
    return response.redirect().toRoute('ai.chats.show', [chat.id])
  }

  @Middleware(middleware.auth())
  @Get('/ai/chats/:chatId', 'ai.chats.show')
  async show({ auth, params, response, inertia }: HttpContext) {
    const chat = await auth
      .user!.related('chats')
      .query()
      .where('id', params.chatId)
      .preload('messages')
      .first()
    if (chat === null) {
      return response.notFound('Chat not found.')
    }

    const projects = await auth.user!.related('projects').query().orderBy('created_at', 'desc')
    const chats = await auth.user!.related('chats').query().orderBy('created_at', 'desc')

    return inertia.render('ai/chat', { chat, projects, chats })
  }

  @Middleware(middleware.auth())
  @Post('/ai/chats/:chatId/chat', 'ai.chats.chat')
  async chat({ auth, params, response }: HttpContext) {
    const chat = await auth
      .user!.related('chats')
      .query()
      .where('id', params.chatId)
      .preload('messages')
      .first()
    if (chat === null) {
      return response.notFound('Chat not found.')
    }

    const anthropic = createAnthropic({
      apiKey: env.get('ANTHROPIC_API_KEY'),
    })
    const model = anthropic('claude-3-5-sonnet-latest')
    const stream = streamText({
      model,
      messages: chat.messages
        .filter((msg) => msg.role !== 'tool')
        .map((msg) => ({
          role: msg.role as 'user' | 'system' | 'assistant',
          content: msg.content,
        })),
      onFinish: async (event) => {
        const message = new Message()
        message.role = 'assistant'
        message.content = event.text
        message.chatId = chat.id
        MessageGenerated.dispatch(message)
      },
    })

    return response.stream(await convertStream(stream.toDataStream()))
  }
}

async function convertStream(readableStream: ReadableStream<Uint8Array>): Promise<Readable> {
  const reader = readableStream.getReader()
  return Readable.from(
    (async function* () {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        yield value
      }
    })()
  )
}
