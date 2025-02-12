import { beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import Post from './post.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'
import RoomMember from './room_member.js'
import BaseModel from '#common/models/base_model'

export default class Room extends BaseModel {
  @beforeCreate()
  static assignSlug(model: Room) {
    model.slug = string.slug(model.name, { lower: true, replacement: '-' })
  }

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare lang: string

  @column()
  declare membersCount: number

  @column()
  declare logo: string | null

  /**
   * Relationships.
   */
  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => RoomMember)
  declare members: HasMany<typeof RoomMember>
}
