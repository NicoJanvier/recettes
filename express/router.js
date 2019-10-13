const express = require("express");
// require('dotenv').config();
const mongoose = require("mongoose");
const { withAuth, withHouse } = require('./middleware');

const Recipe = require("./models/Recipes");
const RecipeV2 = require("./models/Recipe");
const House = require("./models/House");
const User = require("./models/User");
const PlanningPoint = require("./models/PlanningPoint");

const router = express.Router();

// this is our MongoDB database
const dbRoute = process.env.DB_MONGO;
// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

router.get("/recipes", withAuth, withHouse, (req, res) => {
  RecipeV2.find({
    house: req.house,
  })
    .then(recipes => res.status(200).json({ success: true, data: recipes }))
    .catch(err => res.json({ success: false, error: err }))
});

router.get("/recipes-last-planning", withAuth, withHouse, async (req, res) => {
  const { house } = req;
  const recipes = await RecipeV2
    .find({ house })
    .then(result => result || [])
    .catch(() => []);
  const plannings = await PlanningPoint
    .find({ house })
    .then(result => result || [])
    .catch(() => []);
  try {
    const data = recipes.map(({
      _id: recipeId,
      title,
      description,
      vegetarian,
      url,
    }) => {
      const sortedPlannings = plannings
        .filter(({ recipe }) => recipeId.equals(recipe))
        .map(({ date }) => date)
        .sort((a, b) => a > b ? -1 : 1)
      return {
        title,
        description,
        vegetarian,
        url,
        last: sortedPlannings.length ? sortedPlannings[0] : "",
      }
    });
    res.json({ succes: true, data });
  } catch (error) {
    res.status(500).send('Error retrieving recipes with plannings');
  }
});

// Unused
router.get("/recipes/:id", (req, res) => {
  const { id } = req.params;
  RecipeV2.findById(id)
    .populate("house")
    .then(recipe => {
      console.log('GET RECIPE', recipe);
      if (recipe) {
        res.json({ success: true, data: recipe })
      }
      res.status(404).json({ success: false, error: `no resources found at id: ${id}` })
    })
    .catch(err => res.json({ success: false, error: err }))
});

router.post("/recipes", withAuth, withHouse, (req, res) => {
  const {
    title,
    description,
    url,
    vegetarian,
  } = req.body;
  let recipe = new Recipe({
    title,
    description,
    url,
    vegetarian,
    house: req.house,
  });
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

router.delete("/recipes/:id", withAuth, (req, res) => {
  const { id } = req.params;
  Recipe.findByIdAndRemove(id, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/recipe/:recipe_id/planning", withAuth, withHouse, (req, res) => {
  const { house, body: { date, note }, params: { recipe_id } } = req;
  const planning = new PlanningPoint({
    recipe: recipe_id,
    house,
    date,
    note,
  });
  planning.save((err, result) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ succes: true, data: result });
  })
});

router.get("/recipe/:recipe_id/planning", withAuth, withHouse, (req, res) => {
  const { house, params: { recipe_id } } = req;
  PlanningPoint.find({
    recipe: recipe_id,
    house,
  })
    .exec((err, result) => {
      if (err) return res.status(500).json({ error: err });
      return res.json({ success: true, data: result })
    });
});

router.get("/planning", withAuth, withHouse, (req, res) => {
  PlanningPoint.find({
    house: req.house,
  })
    .populate('recipe')
    .exec((err, result) => {
      if (err) return res.status(500).json({ error: err });
      return res.json({ success: true, data: result })
    });
});



const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
router.post("/users/authenticate", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Internal error please try again' });
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
            expiresIn: '30 minutes'
          });
          res.cookie('token', token, { httpOnly: true })
            .sendStatus(200);
        }
      });
    }
  });
});

router.get("/users/checkToken", withAuth, (req, res) => {
  const { email } = req; // Added by withAuth
  User.findOne({ email })
    .populate('house')
    .then(({
      name,
      house,
    }) => res.json({
      email,
      name,
      house: house.name,
    }))
    .catch(err => res.status(500).send(`Error fetching user data ${err}`));
});


const adminRouter = require("./services/admin");
router.use("/admin", adminRouter);

module.exports = router;
