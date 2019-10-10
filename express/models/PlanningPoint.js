const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const PlanningPointSchema = new mongoose.Schema({
  date: { type: String, required: true },
  note: { type: String },
  recipe: { type: ObjectId, required: true, ref: 'RecipeV2' },
  house: { type: ObjectId, required: true, ref: 'House' },
});

module.exports = mongoose.model('PlanningPoint', PlanningPointSchema);