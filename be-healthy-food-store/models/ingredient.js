const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  calo: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  satFat: {
    type: Number,
    required: true,
  },
  transFat: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carb: {
    type: Number,
    required: true,
  },
  fiber: {
    type: Number,
    required: true,
  },
  sugar: {
    type: Number,
    required: true,
  },
  cholesterol: {
    type: Number,
    required: true,
  },
  sodium: {
    type: Number,
    required: true,
  },
  calcium: {
    type: Number,
    required: true,
  },
  iron: {
    type: Number,
    required: true,
  },
  zinc: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

//Export the model
module.exports = mongoose.model("Ingredient", ingredientSchema);
