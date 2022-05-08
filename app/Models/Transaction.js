'use strict'

const Model = use('Model')

class Transaction extends Model {

    account (){
        return this.hasOne('App/Models/Account')
    }

}

module.exports = Transaction
