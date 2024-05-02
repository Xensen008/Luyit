const Review = require("../models/review.model.js");
const Listing = require("../models/listing.model.js");

//post control
module.exports.post=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review added!")
    res.redirect(`/listings/${listing.id}`)
}

//destry control

module.exports.destroy=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!")
    res.redirect(`/listings/${id}`)
}