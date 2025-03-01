import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddEmailVerificationFieldsToUsersTable extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('email_verified').defaultTo(false)
      table.string('verification_code', 6).nullable()
      table.timestamp('email_verified_at').nullable()
      table.timestamp('verification_code_expires_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email_verified')
      table.dropColumn('email_verified_at')
      table.dropColumn('verification_code')
      table.dropColumn('verification_code_expires_at')
    })
  }
}
