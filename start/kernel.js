'use strict'

const Server = use('Server')

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/BodyParser'
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {

  auth: 'Adonis/Middlewares/Auth',
  admin: 'App/Middlewares/admin',
  partner: 'App/Middlewares/partner',
  super: 'App/Middlewares/super-admin',
  secure: 'App/Middlewares/secure-account',
  normalize: 'App/Middlewares/normalize-transaction',
  transfer: 'App/Middlewares/transfer',
  reloadSysMar: 'App/Middlewares/rechargeSysMar',
  reloadMarchand: 'App/Middlewares/rechargeMarchand',
  reloadSystem: 'App/Middlewares/rechargeSystem',
  authentic: 'App/Middlewares/authentic' 
  
}

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server levl middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = [
  'Adonis/Middleware/Static',
  'Adonis/Middleware/Cors'
]

Server
  .registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware)
