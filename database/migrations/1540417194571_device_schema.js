'use strict'

const Schema = use('Schema')

class DeviceSchema extends Schema {
  up () {
    this.create('devices', (table) => {
      table.increments()
      table.integer('account_id').unsigned().references('id').inTable('accounts').onDelete('CASCADE')
      table.string('name', 254).nullable()
      table.string('matricule', 254).notNullable().unique()
      table.string('social', 254).nullable()
      table.string('longitude', 254).nullable()
      table.string('lattitude', 254).nullable()
      //table.integer('transaction_id').unsigned().references('id').inTable('transactions').onDelete('CASCADE')
      table.integer('transaction_count', 80).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('devices')
  }
}

module.exports = DeviceSchema
