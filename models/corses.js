const mongoose = require("mongoose");
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
  
  module.exports = Corse;
  