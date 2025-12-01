const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.reviewRules = () => {
    return [
        body("review_text")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid review."),
    ]
}

validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id, account_id} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("review/add-review", {
      errors,
      title: "Add review",
      nav,
      inv_id,
      review_text,
      account_id
    })
    return
  }
  next()
}

module.exports = validate
