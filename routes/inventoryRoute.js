// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:inv_Id", utilities.handleErrors(invController.buildByInvId));

router.get("", utilities.handleErrors(invController.buildmanager));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

router.post("/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

router.get("/add-vehicle", utilities.handleErrors(invController.buildAddVehicle));

router.post("/add-vehicle", 
    invValidate.vehicleRules(),
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
)


module.exports = router;