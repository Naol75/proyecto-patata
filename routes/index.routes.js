const express = require('express');
const router = express.Router();
const { isLoggedIn, updateLocals } = require("../middlewares/auth.middlewares.js")
router.use(updateLocals)
const Potato = require("../models/Potato.model");

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    if (req.session.user === undefined) {
      // el usuario no está logeado
      res.render("index")
    } else {
      const potatoes = await Potato.find();
      res.render("potatoes/potatoes.hbs", { potatoes });
      
    }
  } 
  
  catch (error) {
    next(error)
  }
  
});


const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter)

const userRouter = require("./user.routes.js")
router.use("/user", userRouter)

const potatoRouter = require("./potatoes.routes.js")
router.use("/potatoes", potatoRouter)

const recipeRouter = require("./recipes.routes.js")
router.use("/recipes", recipeRouter)



module.exports = router;
