const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accController")
const regValidate = require('../utilities/account-validation')

// Route to build inventory detail view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdate));

router.post("/update/info", 
  utilities.checkLogin,
  regValidate.infoUpdateRules(),
  regValidate.checkUpdateInfo,
  utilities.handleErrors(accountController.updateAccountInfo)
)

router.post("/update/password", 
  regValidate.passwordUpdateRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
)

router.get("/logout", utilities.handleErrors(accountController.accountLogout)); 


module.exports = router;