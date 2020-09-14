const mongoose = require("mongoose");

const AnimeName = mongoose.model(
  "Anime",
  new mongoose.Schema({
    title: String,
    discription : String,
    CoverImg:String,
    epNumbers:Number,
    EP: [],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }]
  })
);

module.exports = AnimeName;
