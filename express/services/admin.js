const express = require("express");
const router = express.Router();

const Recipe = require("../models/Recipes");
const RecipeV2 = require("../models/Recipe");
const House = require("../models/House");
const User = require("../models/User");
const PlanningPoint = require("../models/PlanningPoint");

// Register new users
router.post("/users/register", (req, res) => {
  const { email, password, house, name } = req.body;

  House.findOne({ name: house })
    .then(houseDoc => {
      if (!houseDoc) res.status(500).json({ error: `Couldn't find house named ${house}`})
      const user = new User({
        email,
        password,
        house: houseDoc._id,
        name,
      });
      user.save(function(err) {
        if (err) {
          res.status(500).send("Error registering new user please try again.");
        } else {
          res.status(200).send("Welcome to the club!");
        }
      });
    })
    .catch(err => res.status(500).json({error: err}))
});

// One-of recipes migration - 2019-10-13
router.get("/migrate-recipes", (req, res) => {
  House.findOne({ name: "NicoCam" })
    .then(houseDoc => {
      if (!houseDoc) res.status(500).send('ERROR');
      const { _id: houseId } = houseDoc;
      Recipe.find()
        .then(recipes => {
          recipes.forEach( recipe => {
            const { dates, title, description, vegetarian, url } = recipe;
            const newRecipe = new RecipeV2({
              title,
              description,
              vegetarian,
              url,
              house: houseId,
            });
            newRecipe.save((err, result) => {
              if (err) {
                res.status(500).send('ERROR saving new recipe');
              } else {
                const newRecipeId = result._id;
                dates.forEach( ({ date, note}) => {
                  const planning = new PlanningPoint({
                    recipe: newRecipeId,
                    house: houseId,
                    date,
                    note,
                  });
                  planning.save((err, result) => {
                    if (err) {
                      res.status(500).send('ERROR saving new Planning Point');
                    }
                  });
                });
              }
            });
          });
        })
        .catch(err => res.json({ success: false, error: err }))
    })
    .catch(err => res.status(500).json({error: err}))
    .finally(() => res.status(200).send('Done!'))
})

// Create new house
router.post("/house", (req, res) => {
  const { name } = req.body;
  const house = new House({ name });
  house.save((err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/recipes", (req, res) => {
  RecipeV2.find()
    .select("title description url vegetarian")
    .then(recipes => res.status(200).json({ success: true, data: recipes }))
    .catch(err => res.json({ success: false, error: err }))
});

module.exports = router;