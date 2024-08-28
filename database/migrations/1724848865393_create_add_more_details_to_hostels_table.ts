import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hostels'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('gender').defaultTo('')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('gender')
    })
  }
}



