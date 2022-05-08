'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {

/**
 * Make 100% by AMOUH William Têtê
 */

   /**
    * Register user, type: student or people
    */
    //Route.post('register-user/student','UserController.storeStudent') // register a client and create him a account
    Route.post('register-user/people','UserController.storePeople') // register a client and create him a account
    Route.post('register-user/numcard/student','UserController.registerWithCardNumStudent') // take a student card number as userID, register a client and create him a account :{userID}
    Route.post('register-user/numcard/people','UserController.registerWithCardNumPeople') // take a user card number as userID, register a client and create him a account :{userID}

  /**
   * All user's actions in mobile app
   */
    Route.post('mobile-register/user','UserController.mobileRegister') // check the userID and load his account data :{userID, password, email, fullname, phoneNumber}
    Route.put('update-profile/user','UserController.updateProfile').middleware(['authentic']) // User updates his profile :{fullname, email, age, password, phoneNumber}
    Route.post('mobile-login/user','UserController.mobileLogin') // login :{userID, password}
    Route.put('enable-account/user','AccountController.enableAccount').middleware(['authentic']) // enable the account : {accountNumber}
    Route.put('disable-account/user','AccountController.disableAccount').middleware(['authentic']) // disable the account: {accountNumber}
    Route.post('fix-roof/user','AccountController.roofFixing').middleware(['authentic']) // change the roof the and account :{accountNumber, roof}
    Route.post('user-info/userID/user','UserController.getAllByUserID').middleware(['authentic']) // check userID and return all informations about him (account,transaction etc...) {userID}
  /**
   * admin's actions
   */
    Route.post('login/admin','UserController.adminLogin') // if you are not admin you can't logged {userID, password}
    Route.get('all-users/admin','UserController.index').middleware(['admin']) // all user in the system
    Route.post('user-info/id/admin','UserController.getAllById').middleware(['admin']) // check user id and return all informations about him (account,transaction etc...) {id}
    Route.post('user-info/id/partner','UserController.getAllById').middleware(['partner']) // check user id and return all informations about him (account,transaction etc...) {id}
    Route.post('user-info/userID/admin','UserController.getAllByUserID').middleware(['admin']) // check userID and return all informations about him (account,transaction etc...) {userID}
    Route.put('activate-account/admin','AccountController.activateAccount').middleware(['super']) // activate the account of an user :{accountNumber}
    Route.put('deactivate-account/admin','AccountController.deactivateAccount').middleware(['super']) // deactivate the account of an user {accountNumber}
    Route.put('update-profile/admin','UserController.updateProfile').middleware(['admin']) // admin updates his profile :{fullname, email, age, password, phoneNumber}
    Route.put('update-profile-userId','UserController.updateProfileById') // admin updates another profile :{userID, password}
    Route.post('create-admin','UserController.createAdmin').middleware(['super']) // create admin by super admin: {type, fullname, email, password, phoneNumber, accountType}
    Route.get('all-account/admin','AccountController.index').middleware(['admin']) // list of all accounts
    Route.get('all-transaction/admin','TransactionController.index').middleware(['admin']) // list of all transactions
    Route.post('account-info/id/admin','AccountController.getAccountById').middleware(['admin']) // get account by id :{accountId}
    Route.post('account-info/numAccount/admin','AccountController.getAccountByNumAccnount').middleware(['admin']) // get account by accountNumber: {accountNumber}
    Route.get('/typeAndCount', 'UserController.typeAndCount').middleware(['admin']) // return all type and with his count 

  /**
   * Partner's actions
   */
    Route.post('login/partner','UserController.partnerLogin') //if you are not partner you can't logged {userID, password}
    Route.put('update-profile/partner','UserController.updateProfile').middleware(['partner']) // admin updates his profile :{fullname, email, age, password, phone number}
    Route.post('register-partner','UserController.partnerRegister')/**Problem of attemp user (token generation invalid password ..)**/ // store partner: {social, fullname, email, password, PhoneNumber}
    Route.get('all-transaction/partner','TransactionController.index').middleware(['partner']) //list of all transactions
    Route.post('account-info/id/partner','AccountController.getAccountById').middleware(['partner']) // get account by id :{accountId}
    Route.post('account-info/numAccount/partner','AccountController.getAccountByNumAccnount').middleware(['partner']) //get account by accountNumber :{accountNumber}
    Route.post('user-info/userID/partner','UserController.getAllByUserID') // check userID and return all informations about him (account,transaction etc...) {userID}

  /**
   * Used by all
   */
   Route.post('grant-access','UserController.grantAccessUser').middleware(['authentic']) // granted access to user to make something :{password}
   Route.post('access-account','UserController.grantAccessACcount').middleware(['authentic']) // verify account password to make something :{password}

   /**
    * A Changer, Améliorer et Repenser
    */

    Route.post('account-history','AccountController.history') // take account number and return all transaction of this account
    Route.post('payment','TransactionController.moveMoney').middleware(['normalize']) // take users id, transaction's amount and make a transfert into account {userSrcID, userDestID, amount, titleSrc, titleDest, type}
    Route.post('payment-transport','TransactionController.moveMoneyToTransport').middleware(['normalize']) //  take the device id and update the transaction_count, transport's payment
    Route.post('payment/secure','TransactionController.securePayment').middleware(['normalize']) // take users id, and device id transaction's amount and make a secure transfert into account
    Route.post('transfer/secure','TransactionController.secureTransfer').middleware(['normalize']) // take users id,  transaction's amount and make a secure transfert into account
    Route.post('transfer-user','TransactionController.moveMoney').middleware(['normalize','transfer']) // take type of transaction
    Route.post('reload-user/system','TransactionController.moveMoney').middleware(['normalize','reloadSystem']) //take type of transaction
    Route.post('reload-user/partner','TransactionController.moveMoney').middleware(['normalize','reloadMarchand']) //take type of transaction
    Route.post('reload-marchand/system','TransactionController.moveMoney').middleware(['normalize','reloadSysMar']) //take type of transaction
    //Route.post('reload-user','TransactionController.reload') // Reload user balance with mobile money
    //Route.post('reload-marchand','TransactionController.reloadBalance').middleware(['reloadMarchand']) // Reload marchand balance

/**
 * Niveau terminal de payement
 */
  Route.post('device-info/partner','DeviceController.getInfoById') // set the device id and get the info about the device {id}
  Route.post('store-info/device','DeviceController.store') //register the device info {name, accountNumber, social, matricule}
}).prefix('api/v1')