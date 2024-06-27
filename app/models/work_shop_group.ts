import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class WorkShopGroup extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare name : string

  @column()
  declare study_id : string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}