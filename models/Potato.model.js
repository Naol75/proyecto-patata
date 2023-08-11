const mongoose = require("mongoose");

const potatoSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true
  }, 
  name: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Potato = mongoose.model("Potato", potatoSchema);

module.exports = Potato;
