const express = require("express");
const User = require("../models/User.model");
const Potato = require("../models/Potato.model");
const Recipe = require("../models/Recipe.model");
const router = express.Router();
const cloudinaryMulter = require("../middlewares/cloudinary.middlewares");

const {
  isLoggedIn,
  updateLocals,
} = require("../middlewares/auth.middlewares.js");
const { isAdmin, isGourmet } = require("../middlewares/role.middlewares");

router.get("/", async (req, res, next) => {
  try {
    const potatoes = await Potato.find();
    res.render("potatoes/potatoes.hbs", { potatoes });
  } catch (error) {
    next(error);
  }
});

router.post("/addOrRemoveFavoritePotato/:potatoId", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const potatoId = req.params.potatoId;

    const user = await User.findById(userId);

    const isFavorite = user.favPotatoes.includes(potatoId);

    if (!isFavorite) {
      user.favPotatoes.push(potatoId);
    } else {
      user.favPotatoes = user.favPotatoes.filter(favPotatoId => favPotatoId.toString() !== potatoId);
    }

    await user.save();

    if (req.xhr) {
    
      return res.status(200).json({ message: "Potato added/removed successfully" });
    } else {
      
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
});

// los parámetros dinámicos deben ser más descriptivos
router.get("/:id/details", async (req, res, next) => {
  try {
    const potato = await Potato.findById(req.params.id);
    res.render("potatoes/potato-details.hbs", { potato, isAdmin: req.session.user.role === "admin" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const potato = await Potato.findById(req.params.id);

    res.render("potatoes/potato-edit.hbs", { potato });
  } catch (error) {
    next(error);
  }
});


router.post("/:id/edit", cloudinaryMulter.single("img"), async (req, res, next) => {
  try {
    const potatoId = req.params.id;

    const editedPotato = await Potato.findByIdAndUpdate(potatoId,{
      name: req.body.name,
      origin: req.body.origin,
      details: req.body.details,
      img: req.file.path,
      new: true
    });

    res.redirect(`/potatoes/${editedPotato._id}/details`);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/delete", async (req, res, next) => {
  try {
    const potatoId = req.params.id;
    const potato = await Potato.findById(potatoId);
    await Potato.findByIdAndDelete(potatoId);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/newpotato", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const userId = req.session.user._id;

    console.log(userId);
    res.render("potatoes/new-potato.hbs", { userId });
  } catch (error) {
    next(error);
  }
});


router.post("/newpotato", isLoggedIn, isAdmin, cloudinaryMulter.single("img"), async (req, res, next) => {
    try {
      const result = req.file.path;
      const newPotato = new Potato({
        name: req.body.name,
        origin: req.body.origin,
        details: req.body.details,
        img: result,
        owner: req.body.owner,
      });
// Hacer esto con .create()
      res.redirect("/potatoes");
      const savedPotato = await newPotato.save();
      res.json(savedPotato);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
