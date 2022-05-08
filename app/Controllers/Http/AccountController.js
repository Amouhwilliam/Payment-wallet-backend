'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Account = use('App/Models/Account')

class AccountController {
  async index ({response}) {

    try{

      let allAccount = await Account
      .query()
      .orderBy('id','desc')
      .fetch()

       let all = allAccount.toJSON()

       response.status(200).json({
        message: "load accounts successfull",
        status: 200,
        data: all
      })

    }catch(error){
      response.status(404).json({
        message: 'No Account found',
        success: false
      })
    }

  }

  async getAccountById ({request,response}) {

    try{

        const accountInfo = request.all()

        let account = await Account
        .query()
        .where('id',accountInfo.id)
        .with('extAccounts')
        .fetch()

        let account2 = await Account
        .query()
        .where('id',accountInfo.id)
        .with('transactions')
        .fetch()
  
        let user_id = account.toJSON()[0].user_id
        let trans = account2.toJSON()[0].transactions

       // return trans

        const user = await User
        .query()
        .where('id', user_id)
        .fetch()
        
         response.status(200).json({
          message: "successfull",
          status: 200,
          data: account.toJSON()[0],
          transactions: trans,
          user: user.toJSON()[0],
        })
  
      }catch(error){
        response.status(404).json({
          message: 'No account found',
          success: false
        })
      }

  }

  async getAccountByNumAccnount ({request,response}) {

    try{

      const accountInfo = request.all()

      let account = await Account
      .query()
      .where('accountNumber',accountInfo.accountNumber)
      .with('extAccounts')
      .fetch()

      let user_id = account.toJSON()[0].user_id
    
      let account2 = await Account
        .query()
        .where('accountNumber',accountInfo.accountNumber)
        .with('transactions')
        .fetch()
  
      let trans = account2.toJSON()[0].transactions

      const user = await User
      .query()
      .where('id', user_id)
      .fetch()
      
       response.status(200).json({
        message: "successfull",
        status: 200,
        data: account.toJSON()[0],
        transactions: trans,
        user: user.toJSON()[0],
      })

    }catch(error){
      response.status(404).json({
        message: 'No account found',
        success: false
      })
    }

  }

  async roofFixing ({request,response,auth}) {

    const accountInfo = request.all();
    
    let rep = await Database.from('accounts').where('accountNumber', accountInfo.accountNumber)

    const user = await auth.getUser()

    if(rep[0].user_id != user.id){
      
      response.status(403).json({
        message: 'You are not authorized',
        status: 403,
        error: errors.message
      })

    }else{

      const rows = await Database
      .table('accounts')
      .where('accountNumber', accountInfo.accountNumber)
      .update({ roof: accountInfo.roof})

      let rep1 = await Database.from('accounts').where('accountNumber', accountInfo.accountNumber)
      
      response.status(200).json({
        message: 'Operation successful',
        status: 200,
        data: rep1[0]
      })

    }

  }

  async enableAccount ({request,response,auth}) {
    const accountInfo = request.all();

    let rep = await Database.from('accounts').where('accountNumber', accountInfo.accountNumber)

    const user = await auth.getUser()

    if(rep[0].user_id != user.id){
      
      response.status(403).json({
        message: 'You are not authorized',
        status: 403,
        error: errors.message
      })

    }else{

      const rows = await Database
      .table('accounts')
      .where('accountNumber', accountInfo.accountNumber)
      .update({ is_enable: true})
    
      let rep1 = await Database.from('accounts').where('accountNumber', accountInfo.accountNumber)

      response.status(200).json({
        message: 'Operation successful',
        status: 200,
        data: rep1[0]
      })

    }
    
  }

  async disableAccount ({request,response,auth}) {
    const accountInfo = request.all();

    let rep = await Database.from('accounts').where('accountNumber', accountInfo.accountNumber)

    const user = await auth.getUser()

    if(rep[0].user_id != user.id){
      
      response.status(403).json({
        message: 'You are not authorized',
        status: 403,
        error: errors.message
      })

    }else{

      const rows = await Database
      .table('accounts')
      .where('accountNumber', accountInfo.accountNumber)
      .update({ is_enable: false})
    
      let rep1 = await Database.from('accounts').where('accountNumber', accountInfo.accountNumber)

      response.status(200).json({
        message: 'Operation successful',
        status: 200,
        data: rep1[0]
      })

    }

  }

  async activateAccount ({request,response, auth}) {
    const accountInfo = request.all();

    const user = await auth.getUser()

    const rows = await Database
    .table('accounts')
    .where('accountNumber', accountInfo.accountNumber)
    .update({is_enable: true, is_activ: true, adjust_by: user.id})

    let rep = await Database.from('accounts').where('accountNumber', accountInfo.accountNumber)
    

    response.status(200).json({
      message: 'Operation successful',
      status: 200,
      data: rep[0]
    })
  }

  async deactivateAccount ({request,response, auth}) {
    const accountInfo = request.all();

    const user = await auth.getUser()

    const rows = await Database
    .table('accounts')
    .where('accountNumber', accountInfo.accountNumber)
    .update({is_enable: false, is_activ: false, adjust_by: user.id})

    let rep = await Database.from('accounts').where('accountNumber', accountInfo.accountNumber)
    

    response.status(200).json({
      message: 'Operation successful',
      status: 200,
      data: rep[0]
    })
  }


  async history ({request,response}) {
    const accountInfo = request.all();

    const account = await Account
    .query()
    .where('accountNumber', accountInfo.accountNumber)
    .with('transactions')
    .fetch()

    response.status(200).json({
      message: 'opération successful',
      status: 200,
      account: account.toJSON()[0],
    })

  }

  async create () {
  }

  async store () {
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

module.exports = AccountController
