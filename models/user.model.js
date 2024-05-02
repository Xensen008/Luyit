const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const validator = require("validator");

const userschema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address'
        }
    }
});
userschema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userschema);