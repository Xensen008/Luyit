const Listing = require("../models/listing.model.js");
const moment = require('moment');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: maptoken });

// index controller
module.exports.index = async (req, res) => {
    let allListing = await Listing.find({}).sort({ updatedAt: -1 }).populate('reviews');
    allListing = allListing.map(listing => {
        if (listing.reviews.length > 0) {
            const sum = listing.reviews.reduce((total, review) => total + review.rating, 0);
            listing.avgRating = sum / listing.reviews.length;
        } else {
            listing.avgRating = 0;
        }
        return listing;
    });
    res.render("listings/index.ejs", { allListing });
}

//listing controller
module.exports.New = (req, res) => {
    res.render("listings/new.ejs")
}


//create controller
module.exports.create = async (req, res, next) => {
    let geoData = await geoCodingClient.forwardGeocode({
        query: req.body.Listing.location,
        limit: 1
    }).send();
    if (!geoData.body.features.length) {
        req.flash("error", "Invalid Location!")
        return res.redirect("/listings/new");
    }
    req.body.Listing.geometry = geoData.body.features[0].geometry;
    req.setTimeout(120000); // Set the timeout to 2 minutes
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.Listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    newlisting.geometry = req.body.Listing.geometry ;
    await newlisting.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
}


//show controller
//show controller
module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing, moment })
}

//edit controller
module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!")
        return res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload", "upload/q_50");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

//update controller
module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated successfully!")
    res.redirect(`/listings/${id}`);
}

//delete controller
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!")
    res.redirect("/listings")
}