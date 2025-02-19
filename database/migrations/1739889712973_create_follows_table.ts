import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'follows'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table
        .string('follower_id')
        .notNullable()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
      table
        .string('following_id')
        .notNullable()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')

      table.unique(['follower_id', 'following_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.alterTable('profiles', (table) => {
      table.integer('followers_count').defaultTo(0)
      table.integer('following_count').defaultTo(0)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)

    this.schema.alterTable('profiles', (table) => {
      table.dropColumn('followers_count')
      table.dropColumn('following_count')
    })
  }
}
