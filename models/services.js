const mongoose = require("mongoose");
const service = mongoose.model(
    "corse",
    new mongoose.Schema({
        Name: String,
        serviceName:String,
        mail:String,
        phone:Number,
    })
  );
  
  module.exports = Corse;
  