import Message from '#ai/models/message'
import { BaseEvent } from '@adonisjs/core/events'

export default class MessageGenerated extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(public message: Message) {
    super()
  }
}
