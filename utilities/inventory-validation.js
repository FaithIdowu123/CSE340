const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


validate.classificationRules = () => {
    return [
        // firstname is required and must be string
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("Please provide a valid classification name"), // on error this message is sent.
    ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
      
    })
    return
  }
  next()
}

validate.vehicleRules = () => {
    return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle make"), // on error this message is sent.

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle model"), // on error this message is sent.

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt({ min: 1886 })
        .withMessage("Please provide a valid vehicle year"), // on error this message is sent.

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage("Please provide a valid vehicle description"), // on error this message is sent.

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Please provide a valid vehicle price"), // on error this message is sent.

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty() 
        .isFloat({ min: 0 })
        .withMessage("Please provide a valid vehicle mileage"), // on error this message is sent.

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a valid vehicle color"), // on error this message is sent. 
    ]
}

validate.checkVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classification_id = await utilities.buildClassificationSelect()
    res.render("inventory/add-vehicle", {
      errors,
      title: "Add Vehicle",
      nav, 
      classification_id,
      inv_make, 
      inv_model,
      inv_year, 
      inv_description, 
      inv_price, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}



module.exports = validate


