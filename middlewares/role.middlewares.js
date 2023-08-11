function isAdmin(req, res, next) {

    if (req.session.user.role === "admin") {
      next() // adelante
    } else {
      res.redirect("/auth/login")
    }
  }

function isGourmet(req, res, next) {

    if (req.session.user.role === "gourmet") {
      next() // adelante
    } else {
      res.redirect("/auth/login")
    }
  }

  module.exports = { isAdmin, isGourmet }