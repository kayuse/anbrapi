import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registrations'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('room_number').defaultTo(0)
      table.integer('bible_study_group_number').defaultTo(0)
      table.integer('ministry_workshop_group_number').defaultTo(0)
      table.string('age_group').defaultTo('')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('room_number')
      table.dropColumn('bible_study_group_number')
      table.dropColumn('ministry_workshop_group_number')
      table.dropColumn('age_group')
    })
  }
}

