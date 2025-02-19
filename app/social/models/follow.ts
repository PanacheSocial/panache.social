import { beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import db from '@adonisjs/lucid/services/db'
import Profile from './profile.js'
import BaseModel from '#common/models/base_model'

export default class Follow extends BaseModel {
  @belongsTo(() => Profile, { foreignKey: 'followerId' })
  declare follower: BelongsTo<typeof Profile>

  @column()
  declare followerId: string

  @belongsTo(() => Profile, { foreignKey: 'followingId' })
  declare following: BelongsTo<typeof Profile>

  @column()
  declare followingId: string

  @beforeCreate()
  static async incrementFollowCount(follow: Follow) {
    await db.from('profiles').where('id', follow.followerId).increment('following_count', 1)

    await db.from('profiles').where('id', follow.followingId).increment('followers_count', 1)
  }

  @beforeDelete()
  static async decrementFollowCount(follow: Follow) {
    await db.from('profiles').where('id', follow.followerId).increment('following_count', -1)

    await db.from('profiles').where('id', follow.followingId).increment('followers_count', -1)
  }
}
