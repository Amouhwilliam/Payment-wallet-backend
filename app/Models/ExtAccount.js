'use strict'

const Model = use('Model')

class ExtAccount extends Model {
    account (){
        return this.hasOne('App/Models/Account')
    }
}

module.exports = ExtAccount
