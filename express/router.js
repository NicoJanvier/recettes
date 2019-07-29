const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const Recipe = require("./recipe");

const router = express.Router();

// this is our MongoDB database
const dbRoute = process.env.DB_MONGO;

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));


router.get("/recipes", (req, res) => {
  Recipe.find()
    .select("id title description url vegetarian dates")
    .then(recipes => res.json({ success: true, data: recipes }))
    .catch(err => res.json({ success: false, error: err }))
});

router.get("/recipes/:id", (req, res) => {
  const { id } = req.params;
  Recipe.findById(id)
    .select("id title description url vegetarian dates")
    .then(recipes => res.json({ success: true, data: recipes }))
    .catch(err => res.json({ success: false, error: err }))
});

router.post("/recipes", (req, res) => {
  const id = mongoose.Types.ObjectId();
  let recipe = new Recipe({ ...req.body, id });
  try {
    recipe.save((err, result) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: result });
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/recipes/:id", (req, res) => {
  const { id } = req.params;
  Recipe.findByIdAndUpdate(id, { ...req.body }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.delete("/recipes/:id", (req, res) => {
  const { id } = req.params;
  Recipe.findByIdAndRemove(id, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

module.exports = router;
