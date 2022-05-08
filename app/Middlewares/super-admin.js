'use strict'

const Database = use('Database')

class SuperAdmin {
  async handle ({ response, auth }, next) {
    //call next to advance the request
    try {
      //Authentification of the user who make this request
      await auth.check()
      const user = await auth.getUser()

      //Giving the authorization to the SuperAdmin to do this request else error will occured
      if(user.type == 'super-admin' || user.type == 'system'){
        await next()
      }else{
        //Send informations to the view
        response.status(401).json({
          message: 'You are not a super admin.',
          status: 401,
          error: error.message
        })
      }
    } catch (error) {
      //Send informations to the view
      response.status(401).json({
        message: 'You are not authorized to do this action',
        status: 401,
        error: error.message
      })
    }
  }
}

module.exports = SuperAdmin