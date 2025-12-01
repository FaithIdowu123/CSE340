const reviewModel = require("../models/review-model")
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")

const reviewCont = {}

reviewCont.buildAddReviewForm = async function(req, res, next) {
    let nav = await utilities.getNav()
    const inv_id = req.params.inv_id
    const account_id = res.locals.accountData.account_id
    res.render("review/add-review", {
        errors: null,
        title: "Add Review",
        account_id,
        inv_id,
        nav
    })
}

reviewCont.postReview = async function(req, res, next) {
    let nav = await utilities.getNav()
    const { review_text, inv_id, account_id } = req.body
    const insertResult = await reviewModel.insertReview(review_text, inv_id, account_id)
    if (insertResult) {
        req.flash("notice", `Your review was successfully sent.`)
        res.redirect("/inv/detail/"+inv_id)
    } else {
        req.flash("notice", "Sorry, the review failed.")
        const { inv_id } = req.body
        const accountData = await accountModel.getAccountById(req.params.account_id);
        res.render("review/add-review", {
            errors: null,
            title: "Add Review",
            accountData,
            inv_id,
            nav
        })
    }
}

reviewCont.buildDeleteReviewForm = async function(req, res, next){
    let nav = await utilities.getNav()
    const review_id = req.params.review_id
    console.log(review_id)
    const reviews = await reviewModel.getReviewsById(review_id)
    console.log(reviews)
    res.render("review/delete-review", {
        errors: null,
        title: "Delete Review",
        reviews,
        nav
    })
}

reviewCont.deleteReview = async function(req, res, next) {
    const { review_text, review_id, inv_id, account_id } = req.body
    const deleteResult = await reviewModel.deleteReview(review_id)
    if (deleteResult) {
        req.flash("notice", `The review was successfully deleted.`)
        res.redirect("/inv/detail/"+inv_id)
    } else {
        req.flash("notice", "Sorry, the review failed to delete.")
        res.redirect("/review/delete/"+review_id)
    }
}

module.exports = reviewCont;

