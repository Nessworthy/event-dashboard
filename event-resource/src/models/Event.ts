import { Sequelize, DataTypes } from 'sequelize'

export function defineEventModel(sequelize: Sequelize) {

  return sequelize.define('Event', {
      event_id: { type: DataTypes.STRING, primaryKey: true },
      event_name: { type: DataTypes.STRING, allowNull: false },
      event_time: {
          type: DataTypes.INTEGER,
          allowNull: false,
          get() {
              const date = new Date();
              date.setTime(this.getDataValue('event_time') * 1000)
              return date.toISOString()
          },
          set(value: Date) {
              // TODO: We do lose precision here.
              this.setDataValue('event_time', Math.floor(value.getTime()) / 1000)
          }
      },
      event_detail: { type: DataTypes.STRING, allowNull: false },
      event_severity: { type: DataTypes.STRING, allowNull: false },
      object_name: { type: DataTypes.STRING, allowNull: false },
      object_type: { type: DataTypes.STRING, allowNull: false }
  }, { tableName: 'events', timestamps: false })
}
