'use strict'

const {validate} = use('Validator')
const Database = use('Database')
const User = use('App/Models/User')
const Transaction = use('App/Models/Transaction')
const Account = use('App/Models/Account')
const Device = use('App/Models/Device')
const Hash = use('Hash')


class DeviceController {
  async index () {
  }

  async getInfoById ({request,response}) {

    try{
    const deviceInfo = request.all()

    let dev = await Device
    .query()
    .where('id',deviceInfo.id)
    .fetch()

     let info = dev.toJSON()[0]

     response.status(200).json({
      message: "successfull",
      status: 200,
      data: info,
     })

    }catch(error){
      response.status(404).json({
        message: 'No device info found',
        success: false
      })
    }

  }

  async store ({request,response}) {
  
    const deviceInfo = request.all()

    const rules = {
      name: 'required|max:254|min:4',
      matricule: 'required|max:254|min:4',
      accountNumber: 'required',
      social: 'max:254'
    } 


    const validation = await validate(deviceInfo,rules)

    if(validation.fails()){            
        response.status(403).json({
            message: 'Invalid deviceInfo',
            status: 403,
            validation: validation.fails(),
            errors: validation.messages()
        })
    }else {

      //let account = await Database.from('accounts').where('accountNumber', deviceInfo.accountNumber)

      try{

        let acc = await Account
        .query()
        .where('accountNumber', deviceInfo.accountNumber)
        .fetch()
  
        let user_id = acc.toJSON()[0].user_id
        let account_id = acc.toJSON()[0].id
  
        const user = await User
        .query()
        .where('id', user_id)
        .fetch()
  
        let userID = user.toJSON()[0].userID
  
        let devi = await Device
        .query()
        .where('matricule', deviceInfo.matricule)
        .fetch()
  
        let devId, text
   
        if(devi.toJSON()[0]){
           devId = devi.toJSON()[0].id
  
           text = "Connexion successfull"
        }
        else{

          const device = new Device()
  
          device.account_id = account_id
          device.name = deviceInfo.name
          device.matricule = deviceInfo.matricule   
          device.social = deviceInfo.social      
          
          //Persiste user in database with the count
          await device.save()
  
          devId = device.id
          text = "registered successful"
        }
    
        response.status(200).json({
            message: text,
            status: 200,
            userID: userID,
            deviceId: devId,
        })

      }catch(err){

        response.status(403).json({
          message: "Error",
          error: err,
          status: 403
        })

      }
    
    }
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

module.exports = DeviceController
