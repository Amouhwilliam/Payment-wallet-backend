'use strict'

const Schema = use('Schema')

class AccountSchema extends Schema {
  up () {
    this.create('accounts', (table) => {
      table.increments(),
      table.integer('accountNumber', 80).unsigned().notNullable().unique()
      table.double('balance', 254).unsigned().defaultTo(0)
      table.boolean('is_enable', 60).defaultTo(true) // active ou pas (tous les comptes)
      table.string('type', 80).notNullable()
      table.string('password', 254).nullable()
      table.double('roof', 80).notNullable() //roof = plafond a atteindre avant qu'on ne demande de mot de passe pour une transaction
      table.boolean('is_activ', 60).defaultTo(true) //pour les partenaires qui desire avoir un compte(il faut que le super-admin activ les comptes)
      table.integer('adjust_by', 60).nullable() // Know who activate or deactivate the account 
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('accounts')
  }
}

module.exports = AccountSchema
