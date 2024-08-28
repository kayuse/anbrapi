import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Room from './room.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Registration extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column()
  declare gender: string

  @column()
  declare email: string

  @column()
  declare mobile: string

  @column()
  declare address: string
  @column()
  declare occupation: string
  @column()
  declare marital_status: string
  @column()
  declare country: string
  @column()
  declare has_attended: string
  @column()
  declare your_description: string
  @column()
  declare needs_attention: string
  @column()
  declare nursing_mum: string
  @column()
  declare expectations: string
  @column()
  declare invited_by: string
  @column()
  declare registration_id: string

  @column()
  declare biblestudy_id: string

  @column()
  declare workshop_id: string

  @column()
  declare confirmed: boolean

  @column()
  declare year: number

  @column()
  declare bible_study_group_name: string
  @column()
  declare ministry_workshop_group_name: string
  @column()
  declare room_number: number

  @column()
  declare age_group: string

  @column()
  declare bible_study_group_number: number

  @column()

  declare ministry_workshop_group_number: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @belongsTo(() => Room, {
    foreignKey: 'room_number'
  })
  declare hostel: BelongsTo<typeof Room>
}