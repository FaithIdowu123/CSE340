// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require('../utilities/review-validation')

router.get("/add/:inv_id",
    utilities.checkLogin, 
    utilities.handleErrors(reviewController.buildAddReviewForm));

router.post("/add", 
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    utilities.handleErrors(reviewController.postReview));

router.get("/delete/:review_id",
    utilities.checkLogin,
    utilities.reviewAuthorize,
    utilities.handleErrors(reviewController.buildDeleteReviewForm));

router.post("/delete", 
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    utilities.handleErrors(reviewController.deleteReview));
module.exports = router;