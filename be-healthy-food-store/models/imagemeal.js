const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var imagemealSchema = new mongoose.Schema({
  image: {
    type: String,
  },
});

//Export the model
module.exports = mongoose.model("ImageMeal", imagemealSchema);
