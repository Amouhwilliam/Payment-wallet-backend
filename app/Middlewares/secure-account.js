'use strict'

const User = use('App/Models/User')
const Account = use('App/Models/Account')
const Database = use('Database')
const Encryption = use('Encryption')
const Hash = use('Hash')

class SecureAccount {
  async handle ({ request, response }, next) {
    //call next to advance the request
    try {
    
      const transactionInfo = request.all();
      return transactionInfo
      // get user and his account data  
      const userSrc = await User
      .query()
      .where('userID', transactionInfo.userSrcID)
      .with('accounts')
      .fetch()

      // get user account number
      const srcNum_account = userSrc.toJSON()[0].accounts[0].accountNumber
      
      //get user account data
      let srcAccount = await Database.from('accounts').where('accountNumber', srcNum_account)
   
      if(srcAccount[0].password === null){
          //if the account is protect or not
        response.status(401).json({
            message: 'You can\'t make this transaction, please protect you account ',
            status: 401,
            error: "unauthorized error"
          })
      }
      else{

        // verify the account's password
        const isSame = await Hash.verify(transactionInfo.password, srcAccount[0].password)
        //const accountpwd = Encryption.decrypt(`${srcAccount[0].password}`)

        if(isSame){
        await next()
        }else{
        //Send response
        response.status(401).json({
            message: 'access denied, wrong password',
            status: 401,
            error: "unauthorized error"
        })
        }

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

module.exports = SecureAccount