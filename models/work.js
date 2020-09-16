const mongoose = require("mongoose");
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
  
  module.exports = Work;
  