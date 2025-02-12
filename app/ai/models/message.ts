import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BaseModel from '#common/models/base_model'
import Chat from './chat.js'

export default class Message extends BaseModel {
  /**
   * Regular columns.
   */
  @column()
  declare content: string

  @column()
  declare role: 'system' | 'assistant' | 'user' | 'tool'

  /**
   * Relationships.
   */
  @belongsTo(() => Chat, {
    foreignKey: 'chatId',
  })
  declare chat: BelongsTo<typeof Chat>

  @column()
  declare chatId: string
}
