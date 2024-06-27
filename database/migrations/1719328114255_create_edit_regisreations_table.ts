import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registrations'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('your_description')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('your_description')
    })
  }
}