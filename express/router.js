const express = require("express");
// require('dotenv').config();
const mongoose = require("mongoose");
const { withAuth, withHouse } = require('./middleware');

const RecipeV2 = require("./models/Recipe");
// const House = require("./models/House");
const User = require("./models/User");
const PlanningPoint = require("./models/PlanningPoint");

const router = express.Router();

// DATABASE CONNECTION
const dbRoute = process.env.DB_MONGO;
mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

router.get("/recipes", withAuth, withHouse, (req, res) => {
  RecipeV2.find({
    house: req.house,
  })
    .then(recipes => res.status(200).json({ success: true, data: recipes }))
    .catch(err => res.json({ success: false, error: err }))
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
  let recipe = new RecipeV2({
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
  RecipeV2.findByIdAndUpdate(id, { ...req.body }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.delete("/recipes/:id", withAuth, (req, res) => {
  const { id } = req.params;
  RecipeV2.findByIdAndRemove(id, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    PlanningPoint.remove({ recipe: id }, (err) => {
      if (err) console.log(`Couldn't remove PlanningPoints related to Recipe ${id}`)
    });
    return res.json({ success: true, data: data });
  });
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

//Create on Recipe
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

//Create with recipe in body
router.post("/planning", withAuth, withHouse, (req, res) => {
  const { house, body: { date, note, recipe } } = req;
  const planning = new PlanningPoint({
    recipe,
    house,
    date,
    note,
  });
  planning.save((err, result) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ succes: true, data: result });
  })
});

router.put("/planning/:id", withAuth, withHouse, (req, res) => {
  const { body: { date, note,  }, params: { id } } = req;
  PlanningPoint.findByIdAndUpdate(id, {
    date,
    note,
  }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.delete("/planning/:id", withAuth, (req, res) => {
  const { id } = req.params;
  PlanningPoint.findByIdAndRemove(id, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
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
  User
    .findOne({ email })
    .populate('house')
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ error: 'Internal error please try again' });
      } else if (!user) {
        res.status(401).json({ error: 'Incorrect email or password' });
      } else {
        const { house, name } = user;
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
            res
              .cookie('token', token, { httpOnly: true })
              .json({
                email,
                house: house.name,
                name,
              });
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
