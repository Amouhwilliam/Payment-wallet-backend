'use strict'

const {validate} = use('Validator')
const Database = use('Database')
const User = use('App/Models/User')
const Transaction = use('App/Models/Transaction')
const Account = use('App/Models/Account')
const Hash = use('Hash')
class UserController {
    async index ({response}) {

        try{

            let allUser = await User
            .query()
            .orderBy('id','desc')
            .fetch()
      
             let all = allUser.toJSON()
      
             response.status(200).json({
              message: "load users successfull",
              status: 200,
              data: all
            })
      
          }catch(error){
            response.status(404).json({
              message: 'No users found',
              success: false
            })
        }

    }
  
    async getAllById ({request,response}) {

        try{

            const userInfo = request.all()

            let allUser = await User
            .query()
           // .orderBy('id','desc')
            .where('id',userInfo.id)
            .with('accounts')
            .fetch()
      
             let accountNumber = allUser.toJSON()[0].accounts[0].accountNumber
             let accountType = allUser.toJSON()[0].accounts[0].type

            const account1 = await Account
            .query()
            .where('accountNumber', accountNumber)
            .with('transactions')
            .withCount('transactions')
            .fetch()

            const account2 = await Account
            .query()
            .where('accountNumber', accountNumber)
            .with('extAccounts')
            .withCount('extAccounts')
            .fetch()

            let device

            if(accountType === "partner"){
                const account3 = await Account
                .query()
                .where('accountNumber', accountNumber)
                .with('devices')
                .withCount('devices')
                .fetch()
                 device = account3.toJSON()[0].devices
            }

            let transactions = account1.toJSON()[0].transactions
            let external = account2.toJSON()[0].extAccounts
            
            response.status(200).json({
              message: "successfull",
              status: 200,
              data: allUser.toJSON()[0],
              transactions: transactions,
              otherAccount: external,
              devices: accountType === 'partner' ? device : 'not partner'
            })
      
          }catch(error){
            response.status(404).json({
              message: 'No users found',
              success: false
            })
          }

    }
  
    async getAllByUserID ({request,response}) {

        try{

            const userInfo = request.all()

           // return userInfo

            let allUser = await User
            .query()
            .where('userID',userInfo.userID)
            .with('accounts')
            .fetch()

            let accountNumber = allUser.toJSON()[0].accounts[0].accountNumber
            let accountType = allUser.toJSON()[0].accounts[0].type

            const account1 = await Account
            .query()
            .where('accountNumber', accountNumber)
            .with('transactions')
            .withCount('transactions')
            .fetch()

            const account2 = await Account
            .query()
            .where('accountNumber', accountNumber)
            .with('extAccounts')
            .withCount('extAccounts')
            .fetch()

            let device

            if(accountType === "partner"){
                const account3 = await Account
                .query()
                .where('accountNumber', accountNumber)
                .with('devices')
                .withCount('devices')
                .fetch()
                 device = account3.toJSON()[0].devices
            }

           
            let transactions = account1.toJSON()[0].transactions
            let external = account2.toJSON()[0].extAccounts
            

            response.status(200).json({
              message: "successfull",
              status: 200,
              data: allUser.toJSON()[0],
              transactions: transactions,
              otherAccount: external,
              devices: accountType === 'partner' ? device : 'not partner'
            })
      
          }catch(error){
            response.status(404).json({
              message: 'No users found',
              success: false
            })
          }

    }

    async storeStudent ({response}) {

        const userID = parseInt(Math.random().toString().replace('0.', '').substr(1,6))

        const rules = {
            userID: 'required|unique:users|max:80|min:4'
        }

        const validation = await validate(userID,rules)

        if(validation.fails()){            
            response.status(403).json({
                message: 'Invalid userID',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })
        }else {

            //Declare user to containe new information before persist
            const user = new User()
                    
            user.userID = userID
            user.email = "paychap@bidif.com"
            user.password = "paychap"
            user.type = "people"

            //return user.userID
            await user.save()

            const account = new Account()

            account.user_id = user.id
            account.accountNumber = parseInt(Math.random().toString().replace('0.', '').substr(1,4))
            account.type = 'simple'    
            account.roof = 1000    

            //Persiste user in database with the count
            await account.save()

            response.status(200).json({
                message: 'You are registered successful',
                status: 200,
                user: user,
                id: user.userID,
                account: account,
            })

        }

    }

    async storePeople ({response}) {

        const userID = parseInt(Math.random().toString().replace('0.', '').substr(1,6))

        const rules = {
            userID: 'required|unique:users|max:80|min:4'
        }

        const validation = await validate(userID,rules)

        if(validation.fails()){            
            response.status(403).json({
                message: 'Invalid userID',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })
        }else {

            //Declare user to containe new information before persist
            const user = new User()
                    
            user.userID = userID
            user.email = "paychap@bidif.com"
            user.password = "paychap"
            user.type = "people"

            //return user.userID
            await user.save()

            const account = new Account()

            account.user_id = user.id
            account.accountNumber = parseInt(Math.random().toString().replace('0.', '').substr(1,4))
            account.type = 'simple'    
            account.roof = 1000    

            //Persiste user in database with the count
            await account.save()

            response.status(200).json({
                message: 'You are registered successful',
                status: 200,
                user: user,
                id: user.userID,
                account: account,
            })

        }

    }

    async registerWithCardNumStudent ({request,response}) {

        const userInfo = request.all();

        const rules = {
            userID: 'required|unique:users|max:80|min:4'
        }

        const validation = await validate(userInfo,rules)

        if(validation.fails()){            
            response.status(403).json({
                message: 'Invalid userID',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })
        }else {

            //Declare user to containe new information before persist
            const user = new User()
            
            user.userID = userInfo.userID
            user.email = "paychap@bidif.com"
            user.password = "paychap"
            user.type = "people"

            //return user.userID
            await user.save()

            const account = new Account()

            account.user_id = user.id
            account.accountNumber = parseInt(Math.random().toString().replace('0.', '').substr(1,4))
            account.type = 'simple'    
            account.roof = 1000    

            //Persiste user in database with the count
            await account.save()

            response.status(200).json({
                message: 'You are registered successful',
                status: 200,
                user: user,
                id: user.userID,
                account: account,
            })
            
        }

    }

    async registerWithCardNumPeople ({request,response}) {

        const userInfo = request.all();

        const rules = {
            userID: 'required|unique:users|max:80|min:4'
        }

        const validation = await validate(userInfo,rules)

        if(validation.fails()){            
            response.status(403).json({
                message: 'Invalid userID',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })
        }else {

            //Declare user to containe new information before persist
            const user = new User()
            
            user.userID = userInfo.userID
            user.email = "paychap@bidif.com"
            user.password = "paychap"
            user.type = "people"

            //return user.userID
            await user.save()

            const account = new Account()

            account.user_id = user.id
            account.accountNumber = parseInt(Math.random().toString().replace('0.', '').substr(1,4))
            account.type = 'simple'    
            account.roof = 1000    

            //Persiste user in database with the count
            await account.save()

            response.status(200).json({
                message: 'You are registered successful',
                status: 200,
                user: user,
                id: user.userID,
                account: account,
            })
            
        }

    }

    async partnerRegister({request,response,auth}){

        const userInfo = request.all();
       
        const rules = {
           // userID: 'unique:users|max:80|min:4',
            email: 'required|email|max:254',
            password: 'required|max:60|min:4',
            phoneNumber: 'required|max:30|min:8',
            fullname: 'required|max:254|min:4',
            social: 'required|max:254|min:3'
        }

        const validation = await validate(userInfo,rules)

        if(validation.fails()){     

            response.status(403).json({
                message: 'Invalid input',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })

        }else {

            const userID = parseInt(Math.random().toString().replace('0.', '').substr(1,6))

            const user = new User()
            user.userID = userID
            user.fullname = userInfo.fullname
            user.social = userInfo.social
            user.phoneNumber = userInfo.phoneNumber
            user.password = userInfo.password //await Hash.make(userInfo.password)
            user.email = userInfo.email
            user.type = 'partner' 

            //Persiste user in database
            await user.save()
           
            const account = new Account()

            account.user_id = user.id
            account.accountNumber = parseInt(Math.random().toString().replace('0.', '').substr(1,4))
            account.type = 'partner'   
            account.is_activ = 0 
            account.roof = 10000    

            //Persiste user in database with the count
            await account.save()
           
            const token = await auth.attempt( user.userID, userInfo.password)

            const NewUser = await User
            .query()
            .where('userID', user.userID)
            .fetch()
      
            response.status(200).json({
                message: 'Operation successful',
                status: 200,
                user: NewUser,
                account: account,
                token: token
            })
    
        }


    }
    
    async mobileRegister({request,response,auth}){

        const userInfo = request.all();

       // return userInfo

        const rules = {
            userID: 'required|max:80|min:4',
           // email: 'email|max:254',
            password: 'required|max:60|min:4',
            phoneNumber: 'max:30|min:8',
            fullname: 'required|max:254|min:4|unique:users',
        }

        const validation = await validate(userInfo,rules)

        if(validation.fails()){     

            response.status(403).json({
                message: 'Invalid input',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })

        }else {


            if(userInfo.email != undefined){

                const user = await User
                .query()
                .where('userID', userInfo.userID)
                .with('accounts')
                .fetch()

                const affectedRows = await Database
                .table('users')
                .where('userID', userInfo.userID)
                .update({ email: userInfo.email, password: await Hash.make(userInfo.password), phoneNumber: userInfo.phoneNumber, fullname: userInfo.fullname})
                
                const token = await auth.attempt( userInfo.userID, userInfo.password)

                const NewUser = await User
                .query()
                .where('userID', userInfo.userID)
                .fetch()

                response.status(200).json({
                    message: 'Operation successful',
                    status: 200,
                    user: NewUser,
                    token: token
                })
    
            }
            else{

                const user = await User
                .query()
                .where('userID', userInfo.userID)
                .with('accounts')
                .fetch()

                const affectedRows = await Database
                .table('users')
                .where('userID', userInfo.userID)
                .update({ password: await Hash.make(userInfo.password), phoneNumber: userInfo.phoneNumber, fullname: userInfo.fullname})

                const token = await auth.attempt(userInfo.userID, userInfo.password)

                const NewUser = await User
                .query()
                .where('userID', userInfo.userID)
                .fetch()

                response.status(200).json({
                    message: 'Operation successful',
                    status: 200,
                    user: NewUser,
                    token: token
                })
    
            }
        }


    }
  
    async mobileLogin ({request,response,auth}) {

         //Getting iformation coming from request
        const userInfo = request.all();
        const rules = {
            userID: 'required|max:254',
            password: 'required|max:254|min:4'
        }
        //Validation of the request and data coming from the view
        const validation = await validate(userInfo,rules)

        //Administration of errors
        if(validation.fails()){            
            response.status(403).json({
                message: 'user login is failled',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })
        }else {

            //Declare user to containe new information before persist
            const user = await Database.from('users').where('userID', userInfo.userID)
           // return await Hash.verify(userInfo.password, user[0].password)

            if(user.length && await Hash.verify(userInfo.password, user[0].password) ){
                //Generate user token
                const token = await auth.attempt(userInfo.userID,userInfo.password)

                //Send informations to the view
                response.status(200).json({
                    message: 'user is recovery successfully',
                    status: true,
                    user: user[0],
                    token : token
                })
            }else{
                //Send informations to the view
                response.status(444).json({
                    message: 'Wrong password',
                    status: 444
                })
            }        
        }

    }
  
    async adminLogin ({request,response,auth}) {

        //Getting information coming from request
       const userInfo = request.all();
       const rules = {
           userID: 'required|max:254',
           password: 'required|max:254|min:6',
       }
       //Validation of the request and data coming from the view
       const validation = await validate(userInfo,rules)

       //Administration of errors
       if(validation.fails()){            
           response.status(403).json({
               message: 'wrong input',
               status: 403,
               validation: validation.fails(),
               errors: validation.messages()
           })
       }else {
           //Declare user to containe new information before persist
           const user = await Database.from('users').where('userID', userInfo.userID)
           //return user.length

        //    return [await Hash.make(userInfo.password), user[0].password]    
        //    return await Hash.verify(userInfo.password, user[0].password) 

           if(user[0] === undefined ){
            response.status(403).json({
                message: 'You are not an administrator',
                status: 403,
            })
           }else
             if( user[0].type != "admin" && user[0].type != "super-admin" && user[0].type != "system" ){

                response.status(403).json({
                    message: 'You are not an administrator',
                    status: 403,
                })

           }else
           if(user.length && await Hash.verify(userInfo.password, user[0].password) ){
               //Generate user token
               const token = await auth.attempt(userInfo.userID,userInfo.password)
                
               //Send informations to the view
               response.status(200).json({
                   message: 'user is recovery successfully',
                   status: 200,
                   user: user[0],
                   token : token
               })
           }else{
               //Send informations to the view
               response.status(444).json({
                   message: 'Wrong password',
                   status: 444
               })
           }        
       }

   }

   async partnerLogin ({request,response,auth}) {

    //Getting iformation coming from request
        const userInfo = request.all();
        const rules = {
            userID: 'required|max:254',
            password: 'required|max:254|min:6',
        }
        //Validation of the request and data coming from the view
        const validation = await validate(userInfo,rules)

        //Administration of errors
        if(validation.fails()){            
            response.status(403).json({
                message: 'wrong input',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })
        }else {

            //Declare user to containe new information before persist
            const user = await Database.from('users').where('userID', userInfo.userID)
            //return user.length


            if(user[0].type != "partner"){

                response.status(403).json({
                    message: 'You are not authorized',
                    status: 403,
                })

            }else
            if(user.length && await Hash.verify(userInfo.password, user[0].password) ){
                //Generate user token
                const token = await auth.attempt(userInfo.userID,userInfo.password)

                //Send informations to the view
                response.status(200).json({
                    message: 'user is recovery successfully',
                    status: 200,
                    user: user[0],
                    token : token
                })
            }else{
                //Send informations to the view
                response.status(444).json({
                    message: 'Wrong password',
                    status: 444
                })
            }        
        }

    }

    async createAdmin ({request,response,auth}) {

        const userInfo = request.all();

        const rules = {
           // userID: 'required|unique:users|max:80|min:4',
            email: 'required|email|max:254',
            password: 'required|max:60|min:4',
            phoneNumber: 'required|max:20|min:8',
            fullname: 'required|max:254|min:4',
            type: 'required|max:254|min:4',
            accountType: 'required|max:254|min:4',
        }

        const validation = await validate(userInfo,rules)

        if(validation.fails()){     

            response.status(403).json({
                message: 'Invalid input',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })

        }else {


            const userID = parseInt(Math.random().toString().replace('0.', '').substr(1,6))

            const admin = await auth.getUser()

            const user = new User()
            user.userID = userID
            user.fullname = userInfo.fullname
            user.social = "Paychap"
            user.phoneNumber = userInfo.phoneNumber
            user.password = userInfo.password //await Hash.make(userInfo.password)
            user.email = userInfo.email
            user.type = userInfo.type
            user.created_by = admin.id
            
            //Persiste user in database
            await user.save()
           
            const account = new Account()

            account.user_id = user.id
            account.accountNumber = parseInt(Math.random().toString().replace('0.', '').substr(1,4))
            account.type = userInfo.accountType    
            account.roof = 10000    
            //Persiste user in database with the count
            await account.save()
           
            response.status(200).json({
                message: 'Register successful',
                status: 200,
                user: user,
                account: account
            })
    
        }



    }

      async updateProfile ({request, response, auth}) {

        const userInfo = request.all();

       // return userInfo

        const rules = {
            email: 'email|max:254',
            password: 'max:60|min:4',
            phoneNumber: 'max:20|min:8',
            fullname: 'max:254|min:4',
            social: 'max:254|min:4',
            age: 'max:10|min:1'
        }

        const validation = await validate(userInfo,rules)

        if(validation.fails()){     

            response.status(403).json({
                message: 'Invalid input',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })

        }else {

            const user = await auth.getUser()

            user.fullname = userInfo.fullname
            user.social = userInfo.social
            user.age = userInfo.age
            user.phoneNumber = userInfo.phoneNumber
            user.password = await Hash.make(userInfo.password)
            user.email = userInfo.email

            //Persiste user in database
            await user.save()

            response.status(200).json({
                message: 'Update successful',
                status: 200,
                user: user,
            })

        }

    }

    async updateProfileById ({request, response}) {

        const userInfo = request.all();

        const rules = {       
            password: 'max:60|min:4',
        }

        const validation = await validate(userInfo,rules)

        if(validation.fails()){     

            response.status(403).json({
                message: 'Invalid input',
                status: 403,
                validation: validation.fails(),
                errors: validation.messages()
            })

        }else {
     
            const affectedRows = await Database
            .table('users')
            .where('userID', userInfo.userID)
            .update({ password: await Hash.make(userInfo.password) })

            response.status(200).json({
                message: 'Update successful',
                status: 200,
            })

        }

    }


    async grantAccessUser ({request, response, auth}) {

        const userInfo = request.all();
        const password = userInfo.password
        const user = await auth.getUser()

        const isSame = await Hash.verify(password, user.password)

        if(isSame){
            response.status(200).json({
                message: 'Access granted',
                status: 200,
                response: true,
            })
        }
        else{
            response.status(403).json({
                message: 'Access denied',
                status: 403,
                response: false,
            })
        }

    }

    async grantAccessACcount ({request, response, auth}) {

        const AccountInfo = request.all();
        const password = AccountInfo.password
        const numAccount = AccountInfo.numAccount

        let account = await Account
        .query()
        .where('accountNumber',numAccount)
        .fetch()

        let AccountPassword = account.toJSON()[0].password
 

        const isSame = await Hash.verify(password, AccountPassword)

        if(isSame){
            response.status(200).json({
                message: 'Access granted',
                status: 200,
                response: true,
            })
        }
        else{
            response.status(403).json({
                message: 'Access denied',
                status: 403,
                response: false,
            })
        }

    }


    async typeAndCount ({response}) {

        const users = await Database
                            .select('type')
                            .count('type')
                            .groupBy('type')
                            .from('users')  
                            .distinct()
                           
        const accounts = await Database
                            .select('type')
                            .count('type')
                            .groupBy('type')
                            .from('accounts')  
                            .distinct()

        const transactions = await Database
                            .select('type')
                            .count('type')
                            .groupBy('type')
                            .from('transactions')  
                            .distinct()
       
        return {users, accounts, transactions}

    }    
  
    async destroy () {
    }
}

module.exports = UserController
