const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Potato = require("../models/Potato.model");
const Recipe = require("../models/Recipe.model");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
      required: true
    },
    
    favPotatoes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Potato",
    }],
    favRecipes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }

);

const User = mongoose.model("User", userSchema);

module.exports = User;
