import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Hostel from './hostel.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Floor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name : string

  @column()
  declare hostel_id : number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Hostel, {
   foreignKey : 'hostel_id'
  })
  declare hostel : BelongsTo<typeof Hostel>
}