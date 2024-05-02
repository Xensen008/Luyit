const Listing = require("./models/listing.model.js");
const Review = require("./models/review.model.js");
const ExpressError = require("./utils/ExpressErrors.js");
const { listingSchema, reviewSchema} = require("./schema.js");

module.exports.isloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You need to logged in to create listings")
        return res.redirect("/user/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl 
    }
    next()
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not authorized to do this!")    
        return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error)
    }else{
      next();
    }
  }

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    } else {
        next();
    }
}


module.exports.isAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    const review= await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized to do this!")
        return res.redirect(`/listings/${id}`);
    }
    next()
}
