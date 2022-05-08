'use strict'

const User = use('App/Models/User')
const Account = use('App/Models/Account')
const Database = use('Database')
const Encryption = use('Encryption')
const Hash = use('Hash')

class RechargeMarchand {
  async handle ({ request, response }, next) {

    //return  "1"
    //call next to advance the request
    try {
    
      const transactionInfo = request.all();

      // get user and his account data  
      const userSrc = await User
      .query()
      .where('userID', transactionInfo.userSrcID)
      .with('accounts')
      .fetch()

      const userDest = await User
      .query()
      .where('userID', transactionInfo.userDestID)
      .with('accounts')
      .fetch()

      // get users account number
      const srcType = userSrc.toJSON()[0].accounts[0].type
      const destType = userDest.toJSON()[0].accounts[0].type

     // return [srcType, destType]
   
      if( srcType != "partner" || destType != "simple" ){
          //if the account balance is eligible
        response.status(401).json({
            message: 'Please you can\'t do this action',
            status: 401,
            error: "unauthorized error"
          })
      }
      else{
          await next()
      }

     
    } catch (error) {
      //Send response
      response.status(401).json({
        message: 'You are not authorized to do this action',
        status: 401,
        error: error.message
      })
    }
  }
}

module.exports = RechargeMarchand