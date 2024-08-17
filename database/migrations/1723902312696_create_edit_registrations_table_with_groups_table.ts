import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registrations'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('bible_study_group_name').defaultTo('')
      table.string('ministry_workshop_group_name').defaultTo('')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('bible_study_group_name')
      table.dropColumn('ministry_workshop_group_name')
    })
  }
}

