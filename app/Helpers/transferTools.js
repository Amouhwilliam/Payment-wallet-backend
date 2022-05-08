let User = use('App/Models/User')

exports.getAccountNum = function (userID) {
    /** 
    * Return the the account number
    **/

  //  return User
   
   const user = await User
   .query()
   .where('userID', userID)
   .with('accounts')
   .fetch()

   return user.toJSON()[0].accounts[0].accountNumber
   
}

exports.UpdateAccountDest = function (num_account, amount) {

    let rep = await Database.from('accounts').where('accountNumber', num_account)

    bal = rep[0].balance + amount

    let rows = await Database
    .table('accounts')
    .where('accountNumber', num_account)
    .update('balance', bal)

}

exports.UpdateAccountSrc = function (num_account, amount) {

    let rep = await Database.from('accounts').where('accountNumber', num_account)

    bal = rep[0].balance - amount

    let rows = await Database
    .table('accounts')
    .where('accountNumber', num_account)
    .update('balance', bal)

}

exports.getAccountId = function (num_account) {

    let rep = await Database.from('accounts').where('accountNumber', num_account)

    return rep[0].id

}

exports.makeTranfer = function (userDestID, userSrcID, amount) {

    //let rep = await Database.from('accounts').where('accountNumber', num_account)

    //return userDestID

    let transaction = new Transaction()

    transaction.amount = amount
    transaction.dst_account_num = this.getAccountNum (userDestID)
    transaction.type = 'transfer'
    transaction.account_id = this.getAccountId(this.getAccountNum (userSrcID))
    transaction.checked_amount = amount
    transaction.versed_amount = amount    
    transaction.fees = 0

    //Persiste transaction in database with the count
    await transaction.save()

    this.UpdateAccountDest(this.getAccountNum (userDestID), amount)
    this.UpdateAccountSrc(this.getAccountNum (userSrcID), amount)

    return transaction
    
}