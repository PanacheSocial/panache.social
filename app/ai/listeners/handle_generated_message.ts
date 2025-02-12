import MessageGenerated from '#ai/events/message_generated'

export default class HandleGeneratedMessage {
  async handle({ message }: MessageGenerated) {
    await message.save()
  }
}
