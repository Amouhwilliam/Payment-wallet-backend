'use strict'

const Schema = use('Schema')

class ExtAccountSchema extends Schema {
  up () {
    this.create('ext_accounts', (table) => {
      table.increments()
      table.integer('account_id').unsigned().references('id').inTable('accounts').onDelete('CASCADE')
      table.string('name', 254).notNullable()
      table.integer('accountNumber', 80).notNullable().unique()
      table.string('password', 80).notNullable()
      table.string('type', 254).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('ext_accounts')
  }
}

module.exports = ExtAccountSchema
