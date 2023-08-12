const express = require('express');
const router = express.Router();
const { updateLocals } = require("../middlewares/auth.middlewares.js")
router.use(updateLocals)

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
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
