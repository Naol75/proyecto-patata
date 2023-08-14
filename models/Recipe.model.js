const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true
  }, 
  title: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },

  instructions: {
    type: String,
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  potatoes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Potato",
  }],

  
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;