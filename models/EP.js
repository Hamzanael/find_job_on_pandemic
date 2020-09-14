const mongoose = require("mongoose");

const EP = mongoose.model(
  "EP",
  new mongoose.Schema({
    title : String,
    epNumber : Number,
    imgLink : String,
    discribtion:String,
    server1:String,
    server2:String
  })
);

module.exports = EP;
