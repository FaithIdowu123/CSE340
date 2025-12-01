const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

// function to build the vehicle detail view
Util.buildInvDetailView = async function(data){
  let view
  if(data){
    view = '<div id="inv-detail-display">'
    view += '<div id="inv-image">'
    view += '<img src="' + data.inv_image + '" alt="Image of ' 
    + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
    view += '</div>'
    view += '<div id="inv-info">'
    view += '<h2>' + data.inv_make + ' ' + data.inv_model + ' ' + 'details' + '</h2>'
    view += '<ul>'
    view += '<li><strong>Price: </strong>$' 
    + new Intl.NumberFormat('en-US').format(data.inv_price) + '</li>'
    view += '<li><strong>Description: </strong>' + data.inv_description + '</li>'
    view += '<li><strong>Color: </strong>' + data.inv_color + '</li>'
    view += '<li><strong>Miles: </strong>' 
    + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</li>'
    view += '</ul>'
    view += '</div>'
    view += '</div>'
    view += '<a href="../../review/add/'+ data.inv_id +'">Add review</a>'
  } else {
    view = '<p class="notice">Sorry, no vehicle information could be found.</p>'
  }
  return view
}

Util.buildClassificationSelect = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.authorize = (req, res, next) => {
  const accountData = res.locals.accountData
  if (accountData.account_type == "Admin" || accountData.account_type == "Employee") {
    next()
  } else {
    req.flash("notice", "You are not authorized to access that page.")
    return res.redirect("/")
  }
}

Util.reviewAuthorize = async (req, res, next) => {
  const review_id = req.params.review_id
  const accountData = res.locals.accountData
  const account_id = accountData.account_id
  const reviews = await reviewModel.getReviewsById(review_id)
  if (accountData.account_type == "Admin" || accountData.account_type == "Employee" || account_id == reviews.account_id) {
    next()
  } else {
    req.flash("notice", "You are not authorized to edit this review.")
    return res.redirect("/inv/detail/"+reviews.inv_id)
  }
}

Util.buildInventoryReviewList = async function(data) {
  let view 
  console.log(data)
  if(data && data.length > 0){
    view = '<div id="reviews">'
    for (let review of data) {
      const review_id = review.review_id
      const user = await accModel.getAccountById(review.account_id)
      const date = new Date(review.review_date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
      view += '<div id="reviews_container">'
      view += '<h3 id="review_user">'+ user.account_firstname + " " + user.account_lastname + '</h3>'
      view += '<button><a href="../../review/delete/'+ review_id +'" title="click to delete this review">❌</a></button>'
      view += '<p id="review_text">'+ review.review_text + '</p>'
      view += '<p id="review_date">' + date + '</p>'
      view += '</div>'
    }
    view += '</div>'
  } else {
    view = '<p id="reviews"> There are no reviews </p>'
  }
  return view
}

module.exports = Util

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)