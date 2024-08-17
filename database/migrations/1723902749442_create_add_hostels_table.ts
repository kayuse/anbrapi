import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hostels'
  protected floorTableName = 'floors'
  protected roomTableName = 'rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name');
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
    this.schema.createTable(this.floorTableName, (table) => {
      table.increments('id')
      table.string('name')
      table.integer('hostel_id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
    this.schema.createTable(this.roomTableName, (table) => {
      table.increments('id')
      table.string('name')
      table.integer('total')
      table.integer('assigned')
      table.integer('floor_id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.dropTable(this.floorTableName)
    this.schema.dropTable(this.roomTableName);
  }
}