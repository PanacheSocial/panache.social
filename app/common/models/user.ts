import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import BaseModel from './base_model.js'
import Profile from '#social/models/profile'
import Project from '#ai/models/project'
import Chat from '#ai/models/chat'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username', 'email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  /**
   * Regular columns.
   */
  @column()
  declare gender: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare role: string

  @column()
  declare locale: string

  @column({ serializeAs: null })
  declare password: string

  /**
   * Relationships.
   */
  @hasOne(() => Profile, { localKey: 'currentProfileId', foreignKey: 'id' })
  declare currentProfile: HasOne<typeof Profile>

  @column()
  declare currentProfileId: string | null

  @hasMany(() => Profile)
  declare profiles: HasMany<typeof Profile>

  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>

  @hasMany(() => Chat)
  declare chats: HasMany<typeof Chat>
}
