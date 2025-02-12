import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#common/models/user'
import BaseModel from '#common/models/base_model'
import Message from './message.js'

export default class Chat extends BaseModel {
  /**
   * Regular columns.
   */
  @column()
  declare name: string

  /**
   * Relationships.
   */
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>
}
