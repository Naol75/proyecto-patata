const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const cloudinaryMulter = require("../middlewares/cloudinary.middlewares");
const Potato = require("../models/Potato.model");
const Recipe = require("../models/Recipe.model");

const {
  isLoggedIn,
  updateLocals,
} = require("../middlewares/auth.middlewares.js");
//

const uploader = require("../middlewares/cloudinary.middlewares.js");

// ejemplo de alguna ruta privada
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("potatoes/potatoes.hbs");
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render("user/profile.hbs", {
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/profile-update",
  async (req, res, next) => {
    try {
      const userId = req.session.user._id;
      const user = await User.findById(userId);

      res.render("user/profile-update", { userId, user });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/profile/update",
  cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      const userId = req.session.user._id;
      const updatedData = req.body;

      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });

      res.redirect("/user/profile");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.get("/:userId/favrecipes", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("favRecipes");
    const favRecipes = user.favRecipes;


    res.render("user/favrecipes.hbs", {
      favRecipes,
      isAdmin: res.locals.isAdmin,
      isOwner: res.locals.isOwner,
      isGourmet: res.locals.isGourmet,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:userId/favpotatoes", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("favPotatoes");
    const favPotatoes = user.favPotatoes;
    console.log(favPotatoes)

    res.render("user/favpotatoes.hbs", {
      favPotatoes,
      isAdmin: res.locals.isAdmin,
      isOwner: res.locals.isOwner,
      isGourmet: res.locals.isGourmet,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;