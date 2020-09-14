const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const db = require("./models");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(session({
    secret: "Welcome to the best web site",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//Connect with the data Base
mongoose.connect('mongodb://localhost:27017/JobDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set("useCreateIndex", true);
//create user schema
const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    name: String,
    facebookId: String

});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

const User = new mongoose.model("user", UserSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
});

passport.use(new GoogleStrategy({
    clientID: "82635980656-dd4ji63tf7vndjcebg4upvt7dk8kfdud.apps.googleusercontent.com",
    clientSecret: "ipNrKN0fOMQsDirq3wRtlmiM",
    callbackURL: "http://localhost:3000/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function (accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({
        googleId: profile.id,
        username: profile.id,
        name: profile.displayName
    }, function (err, user) {
        return cb(err, user);
    });
}
));



app.get('/', (req, res) => {
res.render("home");
});


app.get('/login', (req, res) => {
res.render("login" , {wrong:false});
});

app.get('/signup', (req, res) => {
res.render("signup" ,{wrong:false});
});

app.get('/loginfail', (req, res) => {
    res.render("login" , {wrong:true}); 	
});

app.get('/tadreeb', (req, res) => {
res.render("tadreeb");
});



app.get('/wazeefeh', (req, res) => {
res.render("wazefeh");
});



/*Google sign in*/

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile']
    })


);

app.get('/auth/google/home',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/");

    });

/*log in and sign up  locally*/
app.post("/login", function(req, res){
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        
        passport.authenticate("local" , { failureRedirect: '/loginfail' })(req, res, function(){
          res.redirect("/");
        });
      }
    });
  
  });


  app.post('/signup', (req, res) => {
    User.register({
        username: req.body.username,name:req.body.name}, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("signUp",{wrong:true});
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/userhome");
            });
        }
    });

}); 

app.post('/saveWork', (req, res) => {
    const newWork=new db.Work({
        JobName: req.body.JobName,
        place:req.body.place,
        study:req.body.study,
        experiance:req.body.experiance,
        salary:req.body.salary,
        phone:req.body.phone,
        mail:req.body.mail,
        hours:req.body.hours,
        discription : req.body.discription,

    });
    newWork.save();

});

app.post('/saveTraning', (req, res) => {
 const newTraning = new db.Corse({
    TranName: req.body.TranName,
    place:req.body.place,
    time:req.body.time,
    cost:req.body.cost,
    period:req.body.period,
    phone:req.body.phone,
    mail:req.body.mail,
    description : req.body.description,

 });

newTraning.save();

});


















app.listen(port || 3000, function () {
    console.log("system is work on" + 3000);
});