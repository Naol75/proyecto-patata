const express = require("express");
const cloudinaryMulter = require('../middlewares/cloudinary.middlewares');
const router = express.Router();

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Potato = require("../models/Potato.model");

const { isLoggedIn, updateLocals } = require("../middlewares/auth.middlewares.js");
const { isAdmin, isOwner } = require("../middlewares/role.middlewares");

router.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.find();
    res.render("recipes/recipes.hbs", { recipes });
  } catch (error) {
    next(error);
  }
});

router.post("/addOrRemoveFavoriteRecipe/:recipeId", isLoggedIn, async (req, res, next) => {
  try {
      const userId = req.session.user._id;
      const recipeId = req.params.recipeId;

      const user = await User.findById(userId);

      const isFavorite = user.favRecipes.includes(recipeId);

      if (!isFavorite) {
          user.favRecipes.push(recipeId);

          
          
          
        }
        else{
          user.favRecipes = user.favRecipes.filter(function(favRecipeId) {
            return favRecipeId.toString() !== recipeId;
          });
        }
        await user.save();


  } catch (error) {
      next(error);
  }
});




router.get("/:id/details", async (req, res, next) => {
  try {

    // crear variables isAdmin e isOwner fuera del render
    const recipe = await Recipe.findById(req.params.id);
    res.render("recipes/recipe-details.hbs", { recipe, isAdmin: req.session.user.role === "admin", isOwner: req.session.user._id.toString() === recipe.owner.toString() });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
  
      res.render("recipes/recipe-edit.hbs", { recipe});


  } catch (error) {
    next(error);
  }
});





router.post("/:id/edit", cloudinaryMulter.single("img"), async (req, res, next) => {
  try {
    const recipeId = req.params.id;

    const editedRecipe = await Recipe.findByIdAndUpdate(recipeId,{
      title: req.body.title,
      time: req.body.time,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      img: req.file.path,
      new: true
    });

    res.redirect(`/recipes/${editedRecipe._id}/details`);
  } catch (error) {
    next(error);
  }
});


//id descriptivo
router.post("/:id/delete", async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    await Recipe.findByIdAndDelete(recipeId);

    res.redirect("/recipes");
  } catch (error) {
    next(error);
  }
});


// new-recipe
router.get("/newrecipe", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.user._id;
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
      owner: req.session.user._id,
      potatoes: req.body.potatoes,
    });


    //.create()
    const savedRecipe = await newRecipe.save();
    res.redirect("/recipes");
  } catch (error) {
    next(error);
  }
});

module.exports = router;