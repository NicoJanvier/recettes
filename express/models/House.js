const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('House', HouseSchema);