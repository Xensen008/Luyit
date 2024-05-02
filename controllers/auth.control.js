const User = require("../models/user.model.js");
// signup page controller
module.exports.renderSignup= (req, res) => {
    res.render("auth/signup.ejs")
}

module.exports.Signup=async (req, res, next) => {
    const { email, password, password2, username } = req.body;
    if (password !== password2) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/user/signup');
    } 

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.email === email) {
                req.flash('error', 'That email is already registered.');
            } else {
                req.flash('error', 'That username is already registered.');
            }
            return res.redirect('/user/signup');
        }

        const user = new User({ email, username });
        await User.register(user, password);
        req.login(user, function(err) {
            if (err) {
                req.flash('error', 'An error occurred');
                return res.redirect('/user/signup');
            }
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', 'An error occurred while signing up.');
        res.redirect('/user/signup');
    }
}

//login page control
module.exports.renderLogin=(req, res) => {
    res.render("auth/login.ejs")
}

//login post
module.exports.login=(req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
}

//logout control

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "logged you out");
        res.redirect("/listings");
    });
}