// /backend/data.js
const mongoose = require("mongoose");

// this will be our data base's data structure 
const DataSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    url: String,
    vegetarian: Boolean,
    dates: [{
      date: String,
      note: String,
    }],
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Recipe", DataSchema);