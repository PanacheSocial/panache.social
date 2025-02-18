import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import BaseModel from '#common/models/base_model'
import User from '#common/models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Comment from '#social/models/comment'
import Post from '#social/models/post'
import PostLike from '#social/models/post_like'
import RoomMember from '#social/models/room_member'

export default class Profile extends BaseModel {
  /**
   * Regular columns.
   */
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @column()
  declare username: string

  @column()
  declare avatar: string

  /**
   * Relationships.
   */
  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => PostLike)
  declare likes: HasMany<typeof PostLike>

  @hasMany(() => RoomMember)
  declare roomMembers: HasMany<typeof RoomMember>
}
