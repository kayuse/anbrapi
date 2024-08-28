import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Floor from './floor.js'

export default class Room extends BaseModel {
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare floor_id: number

  @column()
  declare total: number

  @column()
  declare assigned: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Floor, {
    foreignKey: 'floor_id'
  })
  declare floor: BelongsTo<typeof Floor>
}