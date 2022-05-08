'use strict'

const User = use('App/Models/User')
const Account = use('App/Models/Account')
const Database = use('Database')
const Encryption = use('Encryption')
const Hash = use('Hash')

class NormalizeTransaction {
  async handle ({ request, response }, next) {
    //call next to advance the request
   // return "ok"
    try {
    
      const transactionInfo = request.all();


      //return transactionInfo
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
      const srcNum_account = userSrc.toJSON()[0].accounts[0].accountNumber
      const destNum_account = userDest.toJSON()[0].accounts[0].accountNumber

      //get user account data
      let srcAccount = await Database.from('accounts').where('accountNumber', srcNum_account)
      let destAccount = await Database.from('accounts').where('accountNumber', destNum_account)
   
      if(srcAccount[0].balance === null || srcAccount[0].balance < 10){
          //if the account balance is eligible
        response.status(401).json({
            message: 'the account is not eligible',
            status: 401,
            error: "unauthorized error"
          })
      }
      else{

        // verify the transcation feasability
        const accountBalance = srcAccount[0].balance
        const transactAmount = parseFloat(transactionInfo.amount)
        const accountRoof = srcAccount[0].roof
        const srcAccountState = srcAccount[0].is_enable
        const srcAccountStatus = srcAccount[0].is_activ
        const destAccountState = destAccount[0].is_enable
        const destAccountStatus = destAccount[0].is_activ
        // if the amount of the transaction is less than the roof of the account et less than the account's balance

        if(parseFloat(accountBalance) <= parseFloat(transactAmount) ){

          response.status(401).json({
            message: 'Operation denied, the transaction\'s amount is more than the account\'s balance',
            status: 401,
            error: "unauthorized error",
          })

        }else 
        if(parseFloat(transactAmount) > parseFloat(accountRoof)){

          response.status(401).json({
            message: 'Operation denied, the transaction\'s amount is more the account\'s roof',
            status: 401,
            error: "unauthorized error"
          })

        }else
        if(srcAccountState === 0 || srcAccountStatus === 0){

          response.status(401).json({
            message: 'Operation denied, the source account is disable',
            status: 401,
            error: "unauthorized error"
          })

        }else
        if(destAccountState === 0 || destAccountStatus === 0){

          response.status(401).json({
            message: 'Operation denied, the destination account is disable',
            status: 401,
            error: "unauthorized error"
          })

        }else{
          await next()
        }

      }
    } catch (error) {
      //Send response
      response.status(401).json({
        message: 'You are not authorized to do this action (normalize)',
        status: 401,
        error: error.message
      })
    }
  }
}

module.exports = NormalizeTransaction