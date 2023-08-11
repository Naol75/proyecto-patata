const express = require('express');
const User = require('../models/User.model');
const Potato = require('../models/Potato.model');
const Recipe = require('../models/Recipe.model');
const router = express.Router();

const { isLoggedIn, updateLocals } = require("../middlewares/auth.middlewares.js")
const { isAdmin, isGourmet } = require("../middlewares/role.middlewares")


router.get("/", async (req, res, next) =>  {
    try {
        const potatoes = await Potato.find();
        res.render('potatoes/potatoes.hbs', {potatoes})
    } catch (error) {
        next(error)
    }
})







module.exports = router;