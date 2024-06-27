import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bible_study_groups'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('attendant')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('attendant')
    })
  }
}