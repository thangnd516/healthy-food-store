const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  price: {
    type: Number,
  },
  dateOrder: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Processing",
    enum: ["Cancelled", "Processing", "Success", "Delivering"],
  },
  typeOrder: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  phone: String,
  address: String,
  product: [],
});

//Export the model
module.exports = mongoose.model("Order", orderSchema);
