const mongoose = require("mongoose");
const Review = require("./review.model.js");
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        url:String,
        filename:String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
}, {
  timestamps: true 
});
listingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

listingSchema.methods.calculateAvgRating = function() {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
  } else {
    const sum = this.reviews.reduce((total, review) => {
      return total + review.rating;
    }, 0);
    this.avgRating = sum / this.reviews.length;
  }
  return this.avgRating;
};

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;