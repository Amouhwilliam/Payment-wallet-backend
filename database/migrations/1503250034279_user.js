'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.integer('userID', 60).unsigned().notNullable().unique()
      table.string('fullname', 254).nullable().unique()
      table.string('social', 254).nullable()
      table.string('type', 80).notNullable()
      table.integer('phoneNumber', 80).unsigned().nullable().unique()
      table.integer('age', 60).nullable()
      table.string('email', 254).notNullable()
      table.string('password', 254).notNullable()
      table.integer('created_by', 60).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
