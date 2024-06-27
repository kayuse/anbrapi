import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registrations'
  protected bibleStudyGroups = 'bible_study_groups'
  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('your_description')
    })
    this.schema.alterTable(this.bibleStudyGroups, (table) => {
      table.integer('attendant')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('your_description')
    })
    this.schema.alterTable(this.bibleStudyGroups, (table) => {
      table.dropColumn('attendant')
    })
  }
}