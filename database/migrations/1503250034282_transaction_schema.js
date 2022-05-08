'use strict'

const Schema = use('Schema')

class TransactionSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments()
      table.integer('account_id').unsigned().references('id').inTable('accounts').onDelete('CASCADE')
      table.double('amount', 254).notNullable()
      table.string('title', 254).nullable()
      table.integer('dst_account_num', 80).nullable()
      table.double('num_account_src',80).nullable()
      table.double('num_account_dest', 80).nullable()
      table.double('checked_amount', 254).nullable()
      table.double('versed_amount', 254).nullable()
      table.boolean('is_secure', 60).nullable() // verify if the payment is secure
      table.double('fees', 60).defaultTo(4)
      table.string('type', 80).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionSchema
