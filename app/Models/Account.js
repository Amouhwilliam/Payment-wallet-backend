'use strict'

const Model = use('Model')

class Account extends Model {
    user (){
        return this.hasOne('App/Models/User')
    }

    transactions (){
        return this.hasMany('App/Models/Transaction')
    }

    extAccounts (){
        return this.hasMany('App/Models/ExtAccount')
    }

    devices (){
        return this.hasMany('App/Models/Device')
    }

}

module.exports = Account
