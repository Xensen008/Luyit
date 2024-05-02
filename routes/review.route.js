const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isloggedIn,isAuthor } = require("../middlware.js");
const ReviewController= require("../controllers/review.control.js")

//review
//post route
router.post("/", isloggedIn,validateReview, wrapAsync(ReviewController.post));

//delete review
router.delete("/:reviewId",isloggedIn,isAuthor, wrapAsync(ReviewController.destroy));

module.exports = router;