const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  restaurant: String,
  price: Number,
  available: Boolean,
  appClient: String
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;