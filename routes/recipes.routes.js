const express = require("express");
const cloudinaryMulter = require('../middlewares/cloudinary.middlewares');
const router = express.Router();

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Potato = require("../models/Potato.model");

const {isLoggedIn, updateLocals} = require("../middlewares/auth.middlewares.js");
const { isAdmin, isGourmet, isOwner } = require("../middlewares/role.middlewares");

  router.get("/", async (req, res, next) => {
    try {
      const recipes = await Recipe.find();
      res.render("recipes/recipes.hbs", { recipes });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id/details", async (req, res, next) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      res.render("recipes/recipe-details.hbs", { recipe });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id/edit", async (req, res, next) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (recipe.owner.toString() !== req.session.user._id.toString()) {
        return res.send("You are not allowed to edit this Recipe");
      }
  
      res.render("recipes/recipe-edit.hbs", { recipe });
    } catch (error) {
      next(error);
    }
  });

  router.post("/:id/edit", cloudinaryMulter.single("img"), async (req, res, next) => {
    try {
      console.log(req.body);
      console.log(req.file);

      const recipeId = req.params.id;
      const newData = req.body;

      if (isAdmin || isOwner) {
        next()
      }
      else{
  
        return res.send("You are not allowed to edit this Recipe");
      }

      const editedRecipe = await Recipe.findByIdAndUpdate(recipeId, newData, {
        new: true,
      });

      console.log(editedRecipe);

      res.redirect(`/recipes/${editedRecipe._id}/details`);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/:id/delete", isAdmin, isOwner, async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    if (isAdmin || isOwner) {
      next()
    }
    else{

      return res.send("You are not allowed to delete this Recipe");
    }
    await Recipe.findByIdAndDelete(recipe);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/newrecipe", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.user._id;

    console.log(userId);
    res.render("recipes/new-recipe.hbs", { userId });
  } catch (error) {
    next(error);
  }
});

router.post("/newrecipe", isLoggedIn, cloudinaryMulter.single("img"), async (req, res, next) => {
  try {
    const result = req.file.path;
    const newRecipe = new Recipe({
      title: req.body.title,
      time: req.body.time,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      img: result,
      owner: req.body.owner,
      potatoes: req.body.potatoes
    });

    res.redirect("/recipes");
    const savedRecipe = await newRecipe.save();
    res.json(savedRecipe);
  } catch (error) {
    next(error);
  }
}
);



module.exports = router;