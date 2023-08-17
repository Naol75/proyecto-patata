const express = require("express");
const cloudinaryMulter = require("../middlewares/cloudinary.middlewares");
const router = express.Router();

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Potato = require("../models/Potato.model");

const {
  isLoggedIn,
  updateLocals,
} = require("../middlewares/auth.middlewares.js");
// const { isAdmin, isOwner } = require("../middlewares/role.middlewares");

router.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.find();
    res.render("recipes/recipes.hbs", { recipes });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/addOrRemoveFavoriteRecipe/:recipeId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const userId = req.session.user._id;
      const recipeId = req.params.recipeId;

      const user = await User.findById(userId);

      const isFavorite = user.favRecipes.includes(recipeId);

      if (!isFavorite) {
        await User.findByIdAndUpdate(userId, {
          $push: { favRecipes: recipeId },
        });
      } else {
        await User.findByIdAndUpdate(userId, {
          $pull: { favRecipes: recipeId },
        });
      }

      if (req.xhr) {
        return res
          .status(200)
          .json({ message: "Recipe added/removed successfully" });
      } else {
        res.redirect("/");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:recipeId/details",
  updateLocals,
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { recipeId } = req.params;
      const recipe = await Recipe.findById(recipeId).populate("potatoes");
      const allPotatoes = await Potato.find();
      
      console.log("isAdmin:", res.locals.isAdmin);
      console.log("isOwner:", res.locals.isOwner);
      console.log("isGourmet:", res.locals.isGourmet);

      res.render("recipes/recipe-details.hbs", {
        recipe,
        allPotatoes,
        isAdmin: res.locals.isAdmin,
        isGourmet: res.locals.isGourmet,
        isOwner: res.locals.isOwner,
      });
    } catch (error) {
      next(error);
    }
  }
);


router.get("/:recipeId/edit", async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId);
    const allPotatoes = await Potato.find();
    const clonePotatoes = JSON.parse(JSON.stringify(allPotatoes));

    clonePotatoes.forEach((eachPotato) => {
      if (recipe.potatoes.includes(eachPotato._id)) {
        eachPotato.isSelected = true;
      } else {
        eachPotato.isSelected = false;
      }
    });

    res.render("recipes/recipe-edit.hbs", {
      recipe: recipe,
      allPotatoes: clonePotatoes,
    });
  } catch (error) {
    next(error);
  }
});


router.post(
  "/:recipeId/edit",
  cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      const { title, time, ingredients, instructions, img, potatoes } = req.body;

      const editedRecipe = await Recipe.findByIdAndUpdate(
        req.params.recipeId,
        {
          title,
          time,
          ingredients,
          instructions,
          img,
          potatoes: potatoes,
        },
        { new: true }
      );

      res.redirect(`/recipes/${editedRecipe._id}/details`);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/:recipeId/delete", async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    await Recipe.findByIdAndDelete(recipeId);

    res.redirect("/recipes");
  } catch (error) {
    next(error);
  }
});

router.get("/new-recipe", isLoggedIn, async (req, res, next) => {
  try {
    const allPotatoes = await Potato.find();
    const userId = req.session.user._id;
    res.render("recipes/new-recipe.hbs", { userId, allPotatoes });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/new-recipe",
  isLoggedIn,
  cloudinaryMulter.single("img"),
  async (req, res, next) => {
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

      await Recipe.create(newRecipe);
      const userId = req.session.user._id;
      await User.findByIdAndUpdate(userId, {
        $push: { favRecipes: newRecipe._id },
      });
      res.redirect("/recipes");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;