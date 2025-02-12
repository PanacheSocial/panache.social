import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#common/models/user'
import BaseModel from '#common/models/base_model'

export default class Project extends BaseModel {
  @column()
  declare name: string

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string
}
