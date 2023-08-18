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
// const { isAdmin, isGourmet } = require("../middlewares/role.middlewares");

// Ruta para mostrar la lista de patatas
router.get("/", async (req, res, next) => {
  try {
    const potatoes = await Potato.find();
    res.render("potatoes/potatoes.hbs", { potatoes });
  } catch (error) {
    next(error);
  }
});

// Ruta para agregar o eliminar una patata de los favoritos del usuario
router.post(
  "/addOrRemoveFavoritePotato/:potatoId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const userId = req.session.user._id;
      const potatoId = req.params.potatoId;

      const user = await User.findById(userId);

      const isFavorite = user.favPotatoes.includes(potatoId);

      if (!isFavorite) {
        await User.findByIdAndUpdate(userId, {
          $push: { favPotatoes: potatoId },
        });
      } else {
        await User.findByIdAndUpdate(userId, {
          $pull: { favPotatoes: potatoId },
        });
      }

      if (req.xhr) {
        return res
          .status(200)
          .json({ message: "Potato added/removed successfully" });
      } else {
        res.redirect("/");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para mostrar los detalles de la patata
router.get("/:potatoId/details", async (req, res, next) => {
  try {
    const { potatoId } = req.params;
    const potato = await Potato.findById(potatoId);
    res.render("potatoes/potato-details.hbs", {
      potato,
      isAdmin: res.locals.isAdmin,
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para editar la información de una papa
router.get("/:potatoId/edit", async (req, res, next) => {
  try {
    const { potatoId } = req.params;
    const potato = await Potato.findById(potatoId);

    res.render("potatoes/potato-edit.hbs", { potato });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:potatoId/edit",
  cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      const { potatoId } = req.params;

      const existingPotato = await Potato.findById(potatoId);

      const updatedFields = {
        name: req.body.name,
        origin: req.body.origin,
        details: req.body.details,
      };
      // Actualizar la imagen si se proporciona, de lo contrario, mantener la imagen existente
      if (req.file) {
        updatedFields.img = req.file.path;
      } else {
        updatedFields.img = existingPotato.img;
      }

      // Actualizar la patata
      const editedPotato = await Potato.findByIdAndUpdate(
        potatoId,
        updatedFields,
        {
          new: true,
        }
      );

      res.redirect(`/potatoes/${editedPotato._id}/details`);
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para eliminar una patata
router.post("/:potatoId/delete", async (req, res, next) => {
  try {
    const { potatoId } = req.params;
    await Potato.findByIdAndDelete(potatoId);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// Ruta  para agregar una patata
router.get("/new-potato", isLoggedIn, updateLocals, async (req, res, next) => {
  try {
    const userId = req.session.user._id;

    console.log(userId);
    if (res.locals.isAdmin) {
      res.render("potatoes/new-potato.hbs", { userId });
    } else {
      res.redirect("/auth/login");
    }
  } catch (error) {
    next(error);
  }
});

router.post(
  "/new-potato",
  isLoggedIn,
  updateLocals,
  cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      if (res.locals.isAdmin) {
        const result = req.file.path; //si no ponemos imagen salta error
        const newPotato = new Potato({
          name: req.body.name,
          origin: req.body.origin,
          details: req.body.details,
          img: result,
          owner: req.body.owner,
        });

        // Crear la nueva patata y redirigir
        await Potato.create(newPotato);
        res.redirect("/potatoes");
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
