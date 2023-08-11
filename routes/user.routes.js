const express = require('express');
const User = require('../models/User.model');
const router = express.Router();

const { isLoggedIn, updateLocals } = require("../middlewares/auth.middlewares.js")
const { isAdmin, isGourmet } = require("../middlewares/role.middlewares")

const uploader = require("../middlewares/cloudinary.middlewares.js")

// ejemplo de alguna ruta privada
router.get("/", isLoggedIn, (req, res, next) => {
    res.render("potatoes/potatoes.hbs")
})

router.get("/:userId", isLoggedIn, async (req, res, next) => {
    User.findById(req.session.user._id)
    try {
        res.render("user/profile.hbs", {
            user: response
        })
    } catch (error) {
        next(error)
    }
})
// ejemplo de ruta que recibe la imagen para subirla a cloudinary y actualizar el URL en el documento del usuario

//                                      el nombre del campo donde viene la imagen
//                                                  |
// router.post("/upload-profile-pic", uploader.single("profilePic"),  (req, res, next) => {
//   // cuando nosotros recibimos la imagen
//   // esa imagen la pasamos a cloudinary

//   // cloudinary nos devuelve el URL de acceso
//   console.log(req.file)

//   // buscar el usuario que está subiendo esa imagen, actualizarlo y cambiar su profilePic por el req.file.path de cloudinary
//   User.findByIdAndUpdate( req.session.user._id, {
//     profilePic: req.file.path
//   } )
//   .then(() => {
//     res.redirect("/user/")
//   })
//   .catch((error) => {
//     next(error)
//   })
// })


module.exports = router;