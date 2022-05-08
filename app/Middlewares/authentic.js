'use strict'

class Authentic {
  async handle ({ response, auth }, next) {
    // call next to advance the request
    try {
      await auth.check()
      await next()
    } catch (error) {
      //Send informations to the view
      response.status(401).json({
        status: 401,
        message: 'Unauthorized request',
        error: error.message
      })
    }
  }
}

module.exports = Authentic
