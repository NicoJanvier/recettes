const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  url: String,
  vegetarian: Boolean,
  house: { type: ObjectId, required: true, ref: 'House' },
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("RecipeV2", RecipeSchema, "recipe_v2");