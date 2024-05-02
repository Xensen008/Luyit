const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn,isOwner,validateListing } = require("../middlware.js");
const ListingController= require("../controllers/listing.control.js");
const multer  = require('multer')
const {storage}=require("../cloud.config.js")
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000, // limit to 5MB
  },
});


router
.route("/")
//index route
.get(wrapAsync(ListingController.index))
//create route
.post( isloggedIn,upload.single('Listing[image]'),validateListing, wrapAsync(ListingController.create));


//new route
router.get("/new",isloggedIn,ListingController.New);

router
.route("/:id")
//show route
.get( wrapAsync(ListingController.show))
//update route
.put( isloggedIn,isOwner,upload.single('Listing[image]'),validateListing, wrapAsync(ListingController.update))
//delete route
.delete(isloggedIn,isOwner, wrapAsync(ListingController.delete));


//edit route
router.get("/:id/edit",isloggedIn,isOwner, wrapAsync(ListingController.edit));




module.exports = router;