const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy=require("passport-facebook").Strategy;
const app = express();
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
mongoose.connect('mongodb+srv://admin-hamza:nh19991128@cluster0.kj5ro.mongodb.net/JobDB', 
{useNewUrlParser: true,useUnifiedTopology: true});

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

passport.use(new FacebookStrategy({
    clientID: "808329863268667",
    clientSecret: "40c0f32391ca42a02b15222fcd138b1e",
    callbackURL: "http://localhost:3000/auth/facebook/home"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id,  name: profile.displayName,username: profile.id, }, function (err, user) {
      return cb(err, user);
    });
  }
));




passport.use(new GoogleStrategy({
    clientID: "82635980656-dd4ji63tf7vndjcebg4upvt7dk8kfdud.apps.googleusercontent.com",
    clientSecret: "ipNrKN0fOMQsDirq3wRtlmiM",
    callbackURL: "http://localhost:3000/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function (accessToken, refreshToken, profile, cb) {

    User.findOrCreate({
        googleId: profile.id,
        username: profile.id,
        name: profile.displayName
    }, function (err, user) {
        return cb(err, user);
    });
}
));

const Work = mongoose.model(
    "work",
    new mongoose.Schema({
        JobName: String,
        place:String,
        study:String,
        experiance:String,
        salary:Number,
        phone:String,
        mail:String,
        hours:Number,
        discription : String,
        createDate:String
    })
  );
  const Services = mongoose.model(
    "service",
    new mongoose.Schema({
        Name: String,
        serviceName:String,
        mail:String,
        phone:Number,
    })
  );
  const Corse = mongoose.model(
    "corse",
    new mongoose.Schema({
        TranName: String,
        place:String,
        time:Date,
        cost:Number,
        hours:Number,
        period:Number,
        phone:String,
        mail:String,
        description : String,
        createDate:String
    })
  );

app.get('/', (req, res) => {
    var query =Work.find({}).sort({"_id":-1});
    var query2 = Corse.find({}).sort({"_id":-1});


    if(req.isAuthenticated()){
        query.exec(function(err, work) {
            if (!err) {
                query2.exec(function(err, train) {
                    if (!err) {
                       
                        res.render("home",{login:true, name:req.user.name ,Train:train,Work:work});
                 }});
                

         }else{
             res.send("We Will fix it")
         } 
        });



    

}
    else{
       query.exec(function(err, work) {
            if (!err) {
                query2.exec(function(err, train) {
                    if (!err) {
                       
                        res.render("home",{login:false,Train:train,Work:work});
                 }});
                

         }else{
             res.send("We Will fix it")
         } 
        });}
    
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
        res.render("fail",{login:false});
    }
    
});

app.get('/wazaef', (req, res) => {
    var query = Work.find({}).sort({"_id":-1});
    if(req.isAuthenticated()){
        query.exec(function(err, work) {
            if (!err) {
               
                res.render("wazaef",{Works:work,login:true, name:req.user.name});

         }});
       



}
else{ 
        query.exec(function(err, work) {
            if (!err) {
            
                res.render("wazaef",{Works:work,login:false});

         }});
}
    
    
    
   
});

app.get('/tadreebpage', (req, res) => {
    var query = Corse.find({}).sort({"_id":-1});
    if(req.isAuthenticated()){
        
        query.exec(function(err, train) {
            if (!err) {
             
                res.render("tadreepPage",{Trian:train , login:true, name:req.user.name});

         }});
       



}
else{
        query.exec(function(err, work) {
            if (!err) {
               
                res.render("tadreepPage",{Trian:work , login:false});

         }});
}
    
});

app.get('/wazeefeh', (req, res) => {
    if(req.isAuthenticated()){
    res.render("wazefeh",{login:true , name:req.user.name});
}else{
    res.render("wazefeh",{login:false});
}


});
app.get('/services', (req, res) => {
    if(req.isAuthenticated()){
        res.render("services",{login:true , name:req.user.name});}
    else{
        res.render("services",{login:false });
    }	
});

app.get('/contactUs', (req, res) => {
    if(req.isAuthenticated()){  
res.render("contactUs",{login:true , name:req.user.name});
	} else{
        res.render("contactUs",{login:false});
    }
});


app.get('/workpage/:pageid', (req, res) => {
    if(req.isAuthenticated()){
Work.findById(req.params.pageid,(err,found)=>{
    if(!err){
        res.render("wazefehPage",{work:found,login:true , name:req.user.name,flag:true}); 	
    }
});
    }else{
       Work.findById(req.params.pageid,(err,found)=>{
            if(!err){
                res.render("wazefehPage",{work:found,login:false,flag:true}); 	
            }
        });
    }
    
});

app.get('/trainPage/:pageid', (req, res) => {
    if(req.isAuthenticated()){
    Corse.findById(req.params.pageid,(err,found)=>{
        if(!err){
            res.render("trainPage",{train:found,login:true , name:req.user.name ,flag:true}); 	
        }
    });
} else{
    Corse.findById(req.params.pageid,(err,found)=>{
        if(!err){
            res.render("trainPage",{train:found,login:false ,flag:true}); 	
        }
    });
}
});

app.get('/sucsess', (req, res) => {
    if(req.isAuthenticated()){
        res.render("seccess",{login:true , name:req.user.name});
    }else{
        res.render("seccess",{login:false});
    }


});
app.get('/search_member', function(req, res) {
      
    var regex = new RegExp(req.query["term"], 'i');
    var query = Work.find({JobName: regex}, { 'JobName': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
      
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
    var query = Corse.find({TranName: regex}, { 'TranName': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
      
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

app.post('/search', (req, res) => {
    if(req.isAuthenticated()){
    Work.find({JobName:req.body.searchJob},(err,found)=>{
        if(found.length>0){
           
            res.render("wazefehPage",{work:found[0], login:true , name:req.user.name,flag:true}); 
        }
        if(found.length==0){
            res.render("wazefehPage",{work:null,login:true , name:req.user.name,flag:false});
        }
    });
}
else{
    Work.find({JobName:req.body.searchJob},(err,found)=>{
        if(found.length>0){
      


            res.render("wazefehPage",{work:found[0],login:false ,flag:true}); 
        }
        if(found.length==0){
            res.render("wazefehPage",{work:null,login:false ,flag:false});
        }
    });

}
});

app.post('/trainSearch', (req, res) => {
	if(req.isAuthenticated()){
    Corse.find({TranName:req.body.trainName},(err,found)=>{
            if(found.length>0){
                res.render("trainPage",{train:found[0],login:true , name:req.user.name,flag:true}); 
            }
            if(found.length==0){
                res.render("trainPage",{train:null,login:true , name:req.user.name,flag:false});
            }
        });
    }
    else{
        Corse.find({TranName:req.body.trainName},(err,found)=>{
            if(found.length>0){
               
                
                res.render("trainPage",{train:found[0],login:false , flag:true}); 
            }
            if(found.length==0){
                res.render("trainPage",{train:null,login:false , flag:false});
            }
        });
    
    }
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



    app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/home',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
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
                res.redirect("/");
            });
        }
    });

}); 

app.post('/saveWork', (req, res) => {
    
    const newWork=new Work({
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
    res.redirect("/wazaef");

});

app.post('/saveTraning', (req, res) => {
 const newTraning = new Corse({
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
res.redirect("/tadreepPage'");

});





app.post('/savemassge', (req, res) => {
   
    const newMassge = Services({
    Name: req.body.Name,
    serviceName:req.body.serviceName,
    mail:req.body.mail,
    phone:req.body.phone,
   });
newMassge.save();

res.redirect("sucsess");
   
	
    });












app.listen(port || 3000, function () {
    console.log("system is work on" + 3000);
});