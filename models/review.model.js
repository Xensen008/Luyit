const mongoose= require("mongoose");
const Schema= mongoose.Schema;


const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        max: 5,
        min: 1
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {
  timestamps: true 
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;