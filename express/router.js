const express = require("express");
// require('dotenv').config();
const mongoose = require("mongoose");
const withAuth = require('./middleware');
const Recipe = require("./models/Recipes");

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
    .select("title description url vegetarian dates")
    .then(recipes => res.json({ success: true, data: recipes }))
    .catch(err => res.json({ success: false, error: err }))
});

router.get("/recipes/:id", (req, res) => {
  const { id } = req.params;
  Recipe.findById(id)
    .select("title description url vegetarian dates")
    .then(recipe => {
      console.log('GET RECIPE', recipe);
      if (recipe) {
        res.json({ success: true, data: recipe })
      }
      res.status(404).json({ success: false, error: `no resources found at id: ${id}` })
    })
    .catch(err => res.json({ success: false, error: err }))
});

router.post("/recipes", withAuth, (req, res) => {
  let recipe = new Recipe({ ...req.body });
  try {
    recipe.save((err, result) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: result });
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/recipes/:id", withAuth, (req, res) => {
  const { id } = req.params;
  Recipe.findByIdAndUpdate(id, { ...req.body }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.delete("/recipes/:id", withAuth,(req, res) => {
  const { id } = req.params;
  Recipe.findByIdAndRemove(id, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

const User = require("./models/User");
router.post("/users/register", (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password, group: 'invite' });
  user.save(function(err) {
    if (err) {
      res.status(500)
        .send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});

const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
router.post("users/authenticate", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal error please try again'});
    } else if (!user) {
      res.status(401).json({ error: 'Incorrect email or password' });
    } else {
      user.isCorrectPassword(password, (err, same) => {
        if (err) {
          res.status(500).json({ error: 'Internal error please try again' });
        } else if (!same) {
          res.status(401).json({ error: 'Incorrect email or password' });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true })
            .sendStatus(200);
        }
      });
    }
  });
});

router.get("users/checkToken", withAuth, (req, res) => {
  res.sendStatus(200);
})

module.exports = router;
