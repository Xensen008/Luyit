const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlware.js");
const authController= require("../controllers/auth.control.js")

//sign up
router
.route("/signup")
.get(authController.renderSignup)
.post(wrapAsync(authController.Signup));

//login route
router
.route("/login")
.get(authController.renderLogin)
.post(saveRedirectUrl, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/user/login'
}), authController.login);

//logout
router.get("/logout", authController.logout);

module.exports = router;




// //google auth route
// router.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile','email'] }));

  
// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/user/login', failureFlash: true }),
//   function(req, res) {
//     if (req.isReturningUser) {
//       req.flash('success', 'Welcome back!');
//     } else {
//       req.flash('success', 'Sign up successful. Welcome to WanderLust!');
//     }
//     res.redirect('/listings');
//   });