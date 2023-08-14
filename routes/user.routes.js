const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const cloudinaryMulter = require('../middlewares/cloudinary.middlewares');


const { isLoggedIn, updateLocals } = require("../middlewares/auth.middlewares.js")
const { isAdmin, isGourmet } = require("../middlewares/role.middlewares")

const uploader = require("../middlewares/cloudinary.middlewares.js")

// ejemplo de alguna ruta privada
router.get("/", isLoggedIn, (req, res, next) => {
    res.render("potatoes/potatoes.hbs")
})

router.get("/profile", isLoggedIn, async (req, res, next) => {

    try {
        const user = await User.findById(req.session.user._id)
        res.render("user/profile.hbs", {
            user
        });
    } catch (error) {
        next(error)
    }
})


router.post("/profile/update", cloudinaryMulter.single("img"), async (req, res, next) => {
    try {
      const userId = req.session.user._id
      const updatedData = req.body;
      
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });

      res.redirect('/user/profile');
    } catch (error) {
      next(error);
    }
  }
);

router.get("/logout", (req, res, next) => {

    req.session.destroy(() => {
      res.redirect("/")
    })
  
  })



module.exports = router;