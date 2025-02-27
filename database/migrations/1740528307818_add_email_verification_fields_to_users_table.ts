import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddEmailVerificationFieldsToUsersTable extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('email_verified').defaultTo(false)
      table.timestamp('email_verified_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email_verified')
      table.dropColumn('email_verified_at')
    })
  }
}
