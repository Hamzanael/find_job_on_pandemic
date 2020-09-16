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
    if(req.isAuthenticated()){
    res.render("home",{login:true, name:req.user.name});}
    else{
        res.render("home",{login:false});}
    
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
    if(req.isAuthenticated()){
        res.render("tadreeb",{login:true, name:req.user.name});
    }else{
        res.render("tadreeb",{login:false});
    }
    
});

app.get('/wazaef', (req, res) => {
    if(req.isAuthenticated()){
    db.Work.find({} , (err,found)=>{
        if(!err){
            res.render("wazaef",{Works:found,login:true, name:req.user.name});
        }
        else{
            console.log(err);
        }
    });
    } else{
        db.Work.find({} , (err,found)=>{
            if(!err){
                res.render("wazaef",{Works:found,login:false});
            }
            else{
                console.log(err);
            }
        });
    }
   
});

app.get('/tadreebpage', (req, res) => {
    if(req.isAuthenticated()){
db.Corse.find({},(err,found)=>{
if(!err){
    res.render("tadreepPage",{Trian:found , login:true, name:req.user.name});
}
else{
    console.log(err);
}
});
}else{
    db.Corse.find({},(err,found)=>{
        if(!err){
            res.render("tadreepPage",{Trian:found , login:false});
        }
        else{
            console.log(err);
        }
        });
}
    
});

app.get('/wazeefeh', (req, res) => {
    if(req.isAuthenticated()){
    res.render("wazefeh",{login:true , name:req.user.name});
}else{
    res.redirect("/");
}


});
app.get('/services', (req, res) => {
res.render("services");	
});

app.get('/contactUs', (req, res) => {
res.render("contactUs");	
});
app.get('/workpage/:pageid', (req, res) => {
console.log(req.params.pageid);
db.Work.findById(req.params.pageid,(err,found)=>{
    if(!err){
        res.render("wazefehPage",{work:found}); 	
    }
})

    
});

app.get('/trainPage/:pageid', (req, res) => {
	db.Corse.findById(req.params.pageid,(err,found)=>{
        if(!err){
            res.render("trainPage",{train:found}); 	
        }
    });
    
});


app.get('/search_member', function(req, res) {
      
    var regex = new RegExp(req.query["term"], 'i');
    var query = db.Work.find({JobName: regex}, { 'JobName': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
      
       // Execute query in a callback and return users list
   query.exec(function(err, work) {
       if (!err) {
          // Method to construct the json result set
          var result = JSON.stringify(work);
          res.send(result, {
             'Content-Type': 'application/json'
          }, 200);
       } else {
          res.send(JSON.stringify(err), {
             'Content-Type': 'application/json'
          }, 404);
       }
    });
 });

 app.get('/search_member_traning', (req, res) => {
    var regex = new RegExp(req.query["term"], 'i');
    var query = db.Corse.find({TranName: regex}, { 'TranName': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
      
       // Execute query in a callback and return users list
   query.exec(function(err, work) {
       if (!err) {
          // Method to construct the json result set
          var result = JSON.stringify(work);
          res.send(result, {
             'Content-Type': 'application/json'
          }, 200);
       } else {
          res.send(JSON.stringify(err), {
             'Content-Type': 'application/json'
          }, 404);
       }
    });
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
        createDate :req.body.createdate
    });
    newWork.save();
    res.redirect("/wazeefeh");

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
    hours:req.body.hours,
    createDate:req.body.createdate

 });

newTraning.save(); 
res.redirect("/tadreepPage'")

});





app.post('/savemassge', (req, res) => {
   
    const newMassge = db.Services({
    Name: req.body.Name,
    serviceName:req.body.serviceName,
    mail:req.body.mail,
    phone:req.body.phone,
   });
newMassge.save();

res.render("success");
   
	
    });












app.listen(port || 3000, function () {
    console.log("system is work on" + 3000);
});