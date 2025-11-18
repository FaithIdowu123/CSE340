const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_Id
  const data = await invModel.getInventoryByInvId(inv_id)
  const view = await utilities.buildInvDetailView(data)
  let nav = await utilities.getNav()
  res.render("./inventory/details", {
    title: data.inv_year + " " + data.inv_make + " " + data.inv_model + " ",
    nav,
    view,
  })
}

invCont.buildmanager = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav
  })
}

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body 
  const regResult = await invModel.registerClassification(classification_name)
  let nav = await utilities.getNav()
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you added a new classification ${classification_name}.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash(
      "notice",
      `Sorry, adding the classification ${classification_name} failed. Please try again.`
    )
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classification_id = await utilities.buildClassificationSelect()
  res.render("./inventory/add-vehicle", {
    title: "Add Inventory",
    nav,
    classification_id
  })
}

invCont.addVehicle = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
  const regResult = await invModel.registerVehicle(
    classification_id, 
    inv_make, 
    inv_model,
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail,
    inv_price, 
    inv_miles, 
    inv_color
  )

  let nav = await utilities.getNav()
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you added a new vehicle ${inv_year + " " + inv_model + " " + inv_make}.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash(
      "notice",
      `Sorry, adding the vehicle ${inv_year + " " + inv_model + " " + inv_make} failed. Please try again.`
    )
    res.status(501).render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
    })
  }
}

module.exports = invCont