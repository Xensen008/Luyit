if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8100;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError= require("./utils/ExpressErrors.js");
const listingRouter =require("./routes/listing.route.js");
const reviewRouter  =require("./routes/review.route.js");
const authRouter = require("./routes/auth.route.js");
const session= require("express-session");
const MongoStore=require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.model.js");
const MONGO_URL =  process.env.MONGO_URL;

const store = MongoStore.create({
  mongoUrl:MONGO_URL,
  crypto:{
    secret:"thisshouldbeabettersecret!"
  },
  touchAfter: 24*60*60

})

store.on("error",function(e){
  console.log("Session store error",e)
})


const sessionConfig = {
  store:store,
  secret:"thisshouldbeabettersecret!",
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now()+1000*60*60*24*7, // 1 week cookie
    maxAge:1000*60*60*24*7
  }
}


app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.get("/", (req, res) => {
  res.redirect("/listings")
});

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next()
})



app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/user",authRouter);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"))
});

app.use((err, req, res, next) => {
  let {statusCode=500,message="something went wrong!"} = err
  res.status(statusCode).render("error.ejs",{message})
});

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
