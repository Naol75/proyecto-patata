const Recipe = require("../models/Recipe.model");


function isLoggedIn(req, res, next) {

  if (req.session.user === undefined) {
    // el usuario no está logeado
    res.redirect("/auth/login")
  } else {
    // el usuario si está activo
    next()
  }
}

async function updateLocals(req, res, next) {
  if (req.session.user === undefined) {
    res.locals.isUserActive = false;
    res.locals.isOwner = false;
    res.locals.isGourmet = false;
    res.locals.isAdmin = false;
  } else {
    res.locals.isUserActive = true;
    const userRole = req.session.user.role;
    console.log("userRole:", userRole);
    const userId = req.session.user._id;
    const { recipeId } = req.params;
    res.locals.localId = req.session.user._id
    
    try {
      if (userRole === "gourmet") {
        res.locals.isGourmet = true;
      }
      if (userRole === "admin") {
        res.locals.isAdmin = true;
      }

      const recipe = await Recipe.findById(recipeId);

      if (recipe && userId.toString() === recipe.owner.toString()) {
        res.locals.isOwner = true;
      } else {
        res.locals.isOwner = false;
      }

      console.log("isAdmin:", res.locals.isAdmin);
      console.log("isOwner:", res.locals.isOwner);
      console.log("isGourmet:", res.locals.isGourmet);

      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}



module.exports = {
  isLoggedIn: isLoggedIn,
  updateLocals: updateLocals,
}