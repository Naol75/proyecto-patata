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

router.get("/:id/details", async (req, res, next) => {
  try {
    const potato = await Potato.findById(req.params.id);
    res.render("potatoes/potato-details.hbs", { potato });
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
      console.log(req.body);
      console.log(req.file);

      const potatoId = req.params.id;
      const newData = req.body;

      const editedPotato = await Potato.findByIdAndUpdate(potatoId, newData, {
        new: true,
      });

      console.log(editedPotato);

      res.redirect(`/potatoes/${editedPotato._id}/details`);
    } catch (error) {
      next(error);
    }
  }
);

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

      res.redirect("/potatoes");
      const savedPotato = await newPotato.save();
      res.json(savedPotato);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
