// function isAdmin(req, res, next) {

//     if (req.session.user.role === "admin") {
//       next() // adelante
//     } else {
//       res.redirect("/auth/login")
//     }
//   }

// function isGourmet(req, res, next) {

//   // Llamar a la base de datos de recetas (no hay acceso a recipe)

//   if (req.session.user._id.toString() === recipe.owner.toString()) {
//       next() // adelante
//     }  else {
//       res.redirect("/auth/login")
//     }
//   }


// function isOwner(req, res, next) {

//   if (req.session.user._id.toString() === recipe.owner.toString()) {
//     next() // adelante
//   } else {
//       res.redirect("/auth/login")
//     }
//   }




//   module.exports = { isAdmin, isGourmet, isOwner}