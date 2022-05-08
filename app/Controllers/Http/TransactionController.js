'use strict'
const Transaction = use('App/Models/Transaction')
const {validate} = use('Validator')
const Database = use('Database')
const User = use('App/Models/User')
const Hash = use('Hash')
const Account = use('App/Models/Account')
//let TransferTools = use('./../../Helpers/transferTools')

class TransactionController {
  async index ({response}) {

    try{

      let allTransaction = await Transaction
      .query()
      .orderBy('id','desc')
      .fetch()

       let all = allTransaction.toJSON()

       response.status(200).json({
        message: "load Transactions successfull",
        status: 200,
        data: all
      })

    }catch(error){
      response.status(404).json({
        message: 'No Transactions found',
        success: false
      })
    }


  }

  async create () {
  }

  async store () {
  }

  async moveMoney ({request,response}) {
    const transactionInfo = request.all();
    //return transactionInfo
    //this.TransferTools.makeTranfer(transactionInfo.userDestID, transactionInfo.userSrcID, transactionInfo.amount)
    const amount = transactionInfo.amount
    const type = transactionInfo.type
    const titleSrc = transactionInfo.titleSrc
    const titleDest = transactionInfo.titleDest
    /**
     *  get accunt number with userIDs 
     */
    //return transactionInfo
    const userDest = await User
    .query()
    .where('userID', transactionInfo.userDestID)
    .with('accounts')
    .fetch()

    const userSrc = await User
    .query()
    .where('userID', transactionInfo.userSrcID)
    .with('accounts')
    .fetch()

    /**
     * Create a transction
     */
    const srcNum_account = userSrc.toJSON()[0].accounts[0].accountNumber
    const destNum_account = userDest.toJSON()[0].accounts[0].accountNumber
    
 
// make source transaction

    let transaction1 = new Transaction()
    let srcAccount = await Database.from('accounts').where('accountNumber', srcNum_account)

    transaction1.amount = amount
    transaction1.dst_account_num = destNum_account
    transaction1.type = type
    transaction1.title = titleSrc
    transaction1.account_id = srcAccount[0].id
    transaction1.checked_amount = amount
    transaction1.versed_amount = amount    
    transaction1.fees = 0

// make destation transaction

    let transaction2 = new Transaction()
    let destAccount = await Database.from('accounts').where('accountNumber', destNum_account)

    transaction2.amount = amount
    transaction2.dst_account_num = destNum_account
    transaction2.type = type
    transaction2.title = titleDest
    transaction2.account_id = destAccount[0].id
    transaction2.checked_amount = amount
    transaction2.versed_amount = amount    
    transaction2.fees = 0

//persiste transactions

    await Database.transaction(async (trx) => {
      await transaction1.save(trx)
      await transaction2.save(trx)
    })

    /**
     * Update dest and Src accounts  
     */
    
     // Src opération

     let rep1 = await Database.from('accounts').where('accountNumber', srcNum_account)

      const bal1 = rep1[0].balance - parseFloat(amount)

     let rows1 = await Database
     .table('accounts')
     .where('accountNumber', srcNum_account)
     .update('balance', bal1)

     // Dest opération

     let rep2 = await Database.from('accounts').where('accountNumber', destNum_account)

     const bal2 = rep2[0].balance + parseFloat(amount) 

     let rows2 = await Database
     .table('accounts')
     .where('accountNumber', destNum_account)
     .update('balance', bal2)
 
      //Finish

      response.status(200).json({
        message: 'the opération is successful',
        status: 200,
       transactions: [transaction1,transaction2],
       srcAccount: srcNum_account,
       srcBalance: bal1,
       destBalance: bal2
    })


  }

  async moveMoneyToTransport ({request,response}) {
    const transactionInfo = request.all();
    //return transactionInfo
    //this.TransferTools.makeTranfer(transactionInfo.userDestID, transactionInfo.userSrcID, transactionInfo.amount, transactionInf.deviceId, typeD, typeS)
    const amount = transactionInfo.amount
    const type = "payment"
    const titleSrc = `Paiement d'entrée de bus coût ${amount}`
    const titleDest = `Réception de paiement d'entrée de bus coût ${amount}`
    const deviceId = transactionInfo.deviceId

    /**
     *  get accunt number with userIDs 
     */
    //return transactionInfo
    const userDest = await User
    .query()
    .where('userID', transactionInfo.userDestID)
    .with('accounts')
    .fetch()

    const userSrc = await User
    .query()
    .where('userID', transactionInfo.userSrcID)
    .with('accounts')
    .fetch()

    // return [userDest.toJSON()[0].accounts[0].accountNumber, userSrc.toJSON()[0].accounts[0].accountNumber, transactionInfo.amount]

    /**
     * Create a transaction
     */
    const srcNum_account = userSrc.toJSON()[0].accounts[0].accountNumber
    const destNum_account = userDest.toJSON()[0].accounts[0].accountNumber

// make source transaction

    let transaction1 = new Transaction()
    let srcAccount = await Database.from('accounts').where('accountNumber', srcNum_account)

    transaction1.amount = amount
    transaction1.dst_account_num = destNum_account
    transaction1.type = type
    transaction1.title = titleSrc
    transaction1.account_id = srcAccount[0].id
    transaction1.checked_amount = amount
    transaction1.versed_amount = amount    
    transaction1.fees = 0

// make destation transaction

    let transaction2 = new Transaction()
    let destAccount = await Database.from('accounts').where('accountNumber', destNum_account)

    transaction2.amount = amount
    transaction2.dst_account_num = destNum_account
    transaction2.type = type
    transaction2.title = titleDest
    transaction2.account_id = destAccount[0].id
    transaction2.checked_amount = amount
    transaction2.versed_amount = amount    
    transaction2.fees = 0

//persiste transactions

    await Database.transaction(async (trx) => {
      await transaction1.save(trx)
      await transaction2.save(trx)
    })

/**
 * increment device transaction_count and save the transaction_amount
 */
/*
    await Database
    .table('devices')
    .where('id', deviceId)
    .increment('transaction_count', 1)
*/
    let dev = await Database.from('devices').where('id', deviceId)
    const count = dev[0].transaction_count

    let r = await Database
     .table('devices')
     .where('id', deviceId)
     .update('transaction_count', count+1)


    let dev1 = await Database.from('devices').where('id', deviceId)
    const device_transaction_count = dev1[0].transaction_count
    /**
     * Update dest and Src accounts  
     */
    
     // Src opération

     let rep1 = await Database.from('accounts').where('accountNumber', srcNum_account)



      const bal1 = rep1[0].balance - parseFloat(amount)

     let rows1 = await Database
     .table('accounts')
     .where('accountNumber', srcNum_account)
     .update('balance', bal1)

     // Dest opération

     let rep2 = await Database.from('accounts').where('accountNumber', destNum_account)

     const bal2 = rep2[0].balance + parseFloat(amount) 

     let rows2 = await Database
     .table('accounts')
     .where('accountNumber', destNum_account)
     .update('balance', bal2)
 
      //Finish

      response.status(200).json({
        message: 'the transfer is successful',
        status: 200,
        transactions: [transaction1,transaction2],
       srcAccount: srcNum_account,
       srcBalance: bal1,
       destBalance: bal2,
       device_transaction_count: device_transaction_count
    })


  }

  async securePayment ({request,response}) {
    const transactionInfo = request.all();
    //return transactionInfo
    //this.TransferTools.makeTranfer(transactionInfo.userDestID, transactionInfo.userSrcID, transactionInfo.amount, userSrcPassword, type)
    const amount = transactionInfo.amount
    const type = transactionInfo.type
    const titleSrc = transactionInfo.titleSrc
    const titleDest = transactionInfo.titleDest
    const password = transactionInfo.userSrcPassword
    const deviceId = transactionInfo.deviceId
    /**
     *  get accunt number with userIDs 
     */

    const userDest = await User
    .query()
    .where('userID', transactionInfo.userDestID)
    .with('accounts')
    .fetch()

    const userSrc = await User
    .query()
    .where('userID', transactionInfo.userSrcID)
    .with('accounts')
    .fetch()

    // return [userDest.toJSON()[0].accounts[0].accountNumber, userSrc.toJSON()[0].accounts[0].accountNumber, transactionInfo.amount]

    /**
     * Create a transction
     */
    const srcNum_account = userSrc.toJSON()[0].accounts[0].accountNumber
    const pwd = userSrc.toJSON()[0].accounts[0].password
    const destNum_account = userDest.toJSON()[0].accounts[0].accountNumber
    const isSame = await Hash.verify(password, pwd)

    if(!isSame){

      response.status(403).json({
        message: 'Access denied',
        status: 403,
        response: false,
     })

    }else{

     // make source transaction

    let transaction1 = new Transaction()
    let srcAccount = await Database.from('accounts').where('accountNumber', srcNum_account)

    transaction1.amount = amount
    transaction1.dst_account_num = destNum_account
    transaction1.type = type
    transaction1.title = titleSrc
    transaction1.account_id = srcAccount[0].id
    transaction1.checked_amount = amount
    transaction1.versed_amount = amount    
    transaction1.fees = 0

    // make destation transaction

    let transaction2 = new Transaction()
    let destAccount = await Database.from('accounts').where('accountNumber', destNum_account)

    transaction2.amount = amount
    transaction2.dst_account_num = destNum_account
    transaction2.type = type
    transaction2.title = titleDest
    transaction2.account_id = destAccount[0].id
    transaction2.checked_amount = amount
    transaction2.versed_amount = amount    
    transaction2.fees = 0

    //persiste transactions

    await Database.transaction(async (trx) => {
      await transaction1.save(trx)
      await transaction2.save(trx)
    })


  
      /**
       * Update dest and Src accounts  
       */
      
       // Src opération
  
       let rep1 = await Database.from('accounts').where('accountNumber', srcNum_account)
  
       const bal1 = rep1[0].balance - parseFloat(amount)
  
       let rows1 = await Database
       .table('accounts')
       .where('accountNumber', srcNum_account)
       .update('balance', bal1)
  
       // Dest opération
  
       let rep2 = await Database.from('accounts').where('accountNumber', destNum_account)
  
       const bal2 = rep2[0].balance + parseFloat(amount) 
  
       let rows2 = await Database
       .table('accounts')
       .where('accountNumber', destNum_account)
       .update('balance', bal2)
   
        //Finish
  
        response.status(200).json({
          message: 'the transfer is successful',
          status: 200,
          transactions: [transaction1,transaction2],
          srcAccount: srcNum_account,
          srcBalance: bal1,
          destBalance: bal2
        })

     }

  }

  async secureTransfer ({request,response}) {
    const transactionInfo = request.all();
    //return transactionInfo
    //this.TransferTools.makeTranfer(transactionInfo.userDestID, transactionInfo.userSrcID, transactionInfo.amount, userSrcPassword, type)
    const amount = transactionInfo.amount
    const typeSrc = transactionInfo.typeSrc
    const typeDest = transactionInfo.typeDest
    const password = transactionInfo.userSrcPassword
    /**
     *  get accunt number with userIDs 
     */

    const userDest = await User
    .query()
    .where('userID', transactionInfo.userDestID)
    .with('accounts')
    .fetch()

    const userSrc = await User
    .query()
    .where('userID', transactionInfo.userSrcID)
    .with('accounts')
    .fetch()

    // return [userDest.toJSON()[0].accounts[0].accountNumber, userSrc.toJSON()[0].accounts[0].accountNumber, transactionInfo.amount]

    /**
     * Create a transction
     */
    const srcNum_account = userSrc.toJSON()[0].accounts[0].accountNumber
    const pwd = userSrc.toJSON()[0].accounts[0].password
    const destNum_account = userDest.toJSON()[0].accounts[0].accountNumber
    const isSame = await Hash.verify(password, pwd)

    if(!isSame){

      response.status(403).json({
        message: 'Access denied',
        status: 403,
        response: false,
     })

    }else{

     // make source transaction

    let transaction1 = new Transaction()
    let srcAccount = await Database.from('accounts').where('accountNumber', srcNum_account)

    transaction1.amount = amount
    transaction1.dst_account_num = destNum_account
    transaction1.type = typeSrc
    transaction1.account_id = srcAccount[0].id
    transaction1.checked_amount = amount
    transaction1.versed_amount = amount    
    transaction1.fees = 0

    // make destation transaction

    let transaction2 = new Transaction()
    let destAccount = await Database.from('accounts').where('accountNumber', destNum_account)

    transaction2.amount = amount
    transaction2.dst_account_num = destNum_account
    transaction2.type = typeDest
    transaction2.account_id = destAccount[0].id
    transaction2.checked_amount = amount
    transaction2.versed_amount = amount    
    transaction2.fees = 0

    //persiste transactions

    await Database.transaction(async (trx) => {
      await transaction1.save(trx)
      await transaction2.save(trx)
    })


  
      /**
       * Update dest and Src accounts  
       */
      
       // Src opération
  
       let rep1 = await Database.from('accounts').where('accountNumber', srcNum_account)
  
       const bal1 = rep1[0].balance - parseFloat(amount)
  
       let rows1 = await Database
       .table('accounts')
       .where('accountNumber', srcNum_account)
       .update('balance', bal1)
  
       // Dest opération
  
       let rep2 = await Database.from('accounts').where('accountNumber', destNum_account)
  
       const bal2 = rep2[0].balance + parseFloat(amount) 
  
       let rows2 = await Database
       .table('accounts')
       .where('accountNumber', destNum_account)
       .update('balance', bal2)
   
        //Finish
  
        response.status(200).json({
          message: 'the transfer is successful',
          status: 200,
          transactions: [transaction1,transaction2],
          srcAccount: srcNum_account,
          srcBalance: bal1,
          destBalance: bal2
        })

     }

  }

  async reload ({request,response}){

    const transactionInfo = request.all();
    //return transactionInfo
    //this.TransferTools.makeTranfer(transactionInfo.userDestID, transactionInfo.userSrcID, transactionInfo.amount)
    const amount = transactionInfo.amount
    const userSrcID = 505571
    const srcNum_account = 8056
    const srcAccountID = 5
    const num_mobMoney_dest = 92075520
    const amountVersed = (parseFloat(amount) - parseFloat(amount)*0.04)

    /**
     *  get accunt number with userIDs 
     */
    

    const userDest = await User
    .query()
    .where('userID', transactionInfo.userDestID)
    .with('accounts')
    .fetch()

    const userSrc = await User
    .query()
    .where('userID', userSrcID)
    .with('accounts')
    .fetch()

    // return [userDest.toJSON()[0].accounts[0].accountNumber, userSrc.toJSON()[0].accounts[0].accountNumber, transactionInfo.amount]

    /**
     * Create a transaction
     */
    const destNum_account = userDest.toJSON()[0].accounts[0].accountNumber
    let transaction = new Transaction()

    transaction.amount = amount
    transaction.dst_account_num = destNum_account
    transaction.type = 'recharge'
    transaction.num_mobMoney_src = transactionInfo.num_mobMoney_src  
    transaction.num_mobMoney_dest = num_mobMoney_dest
    //transaction.type = 'transfer'
    transaction.account_id = srcAccountID
    transaction.checked_amount = amount
    transaction.versed_amount = amountVersed    
    transaction.fees = 4

    //Persiste transaction into the database 
    await transaction.save()

    //return transaction

    /**
     * Update dest and Src accounts  
     */
    
     // Src opération

     let rep1 = await Database.from('accounts').where('accountNumber', srcNum_account)

      const bal1 = rep1[0].balance - amountVersed

     let rows1 = await Database
     .table('accounts')
     .where('accountNumber', srcNum_account)
     .update('balance', bal1)

     // Dest opération

     let rep2 = await Database.from('accounts').where('accountNumber', destNum_account)

     const bal2 = rep2[0].balance + amountVersed

     let rows2 = await Database
     .table('accounts')
     .where('accountNumber', destNum_account)
     .update('balance', bal2)
 
      //Finish

      response.status(200).json({
        message: 'the transfer is successful',
        status: 200,
       transaction: transaction,
       srcAccount: srcNum_account,
       srcBalance: bal1,
       destBalance: bal2
    })


  }

  async reloadBalance ({request,response}) {

    const transactionInfo = request.all();
    //return transactionInfo
    //this.TransferTools.makeTranfer(transactionInfo.userDestID, transactionInfo.userSrcID, transactionInfo.amount)
    const amount = transactionInfo.amount
    const userSrcID = 566754
    const srcNum_account = 8056
    const srcAccountID = 5

    /**
     *  get accunt number with userIDs 
     */

    const userDest = await User
    .query()
    .where('userID', transactionInfo.userDestID)
    .with('accounts')
    .fetch()

    const userSrc = await User
    .query()
    .where('userID', userSrcID)
    .with('accounts')
    .fetch()

    // return [userDest.toJSON()[0].accounts[0].accountNumber, userSrc.toJSON()[0].accounts[0].accountNumber, transactionInfo.amount]

    /**
     * Create a transction
     */
    const destNum_account = userDest.toJSON()[0].accounts[0].accountNumber
    let transaction = new Transaction()

  

    transaction.amount = amount
    transaction.dst_account_num = destNum_account
    transaction.type = 'transfer'
    transaction.account_id = srcAccountID
    transaction.checked_amount = amount
    transaction.versed_amount = amount    
    transaction.fees = 0

    //Persiste transaction into the database 
    await transaction.save()

    //return transaction

    /**
     * Update dest and Src accounts  
     */
    
     // Src opération

     let rep1 = await Database.from('accounts').where('accountNumber', srcNum_account)

      const bal1 = rep1[0].balance - parseFloat(amount)

     let rows1 = await Database
     .table('accounts')
     .where('accountNumber', srcNum_account)
     .update('balance', bal1)

     // Dest opération

     let rep2 = await Database.from('accounts').where('accountNumber', destNum_account)

     const bal2 = rep2[0].balance + parseFloat(amount) 

     let rows2 = await Database
     .table('accounts')
     .where('accountNumber', destNum_account)
     .update('balance', bal2)
 
      //Finish

      response.status(200).json({
        message: 'the transfer is successful',
        status: 200,
       transaction: transaction,
       srcAccount: srcNum_account,
       srcBalance: bal1,
       destBalance: bal2
    })


  }

  async show () {
  }

  async edit () {
  }

  async update () {
  }

  async destroy () {
  }
}

module.exports = TransactionController
