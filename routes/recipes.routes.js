const express = require("express");
const cloudinaryMulter = require('../middlewares/cloudinary.middlewares');
const router = express.Router();

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Potato = require("../models/Potato.model");

const {isLoggedIn, updateLocals} = require("../middlewares/auth.middlewares.js");
const { isAdmin, isGourmet } = require("../middlewares/role.middlewares");

  router.get("/", async (req, res, next) => {
    try {
      const recipes = await Recipe.find();
      res.render("recipes/recipes.hbs", { recipes });
    } catch (error) {
      next(error);
    }
  });



module.exports = router;