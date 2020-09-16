const mongoose = require("mongoose");
const Services = mongoose.model(
    "service",
    new mongoose.Schema({
        Name: String,
        serviceName:String,
        mail:String,
        phone:Number,
    })
  );
  
  module.exports = Services;
  