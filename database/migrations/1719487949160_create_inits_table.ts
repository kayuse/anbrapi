import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registrations'
  protected bibleStudyTableName = 'bible_study_groups'
  protected workshopTableName = 'workshop_groups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('firstname')
      table.string('lastname')
      table.string('email')
      table.string('mobile')
      table.string('address')
      table.string('occupation')
      table.string('marital_status')
      table.string('country')
      table.string('has_attended')
      table.string('needs_attention')
      table.string('nursing_mum')
      table.string('expectations')
      table.string('invited_by')
      table.string('registration_id')
      table.string('biblestudy_id')
      table.string('workshop_id')
      table.integer('year')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable(this.bibleStudyTableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('study_id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
    this.schema.createTable(this.workshopTableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('study_id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.dropTable(this.bibleStudyTableName)
    this.schema.dropTable(this.workshopTableName)
  }
}