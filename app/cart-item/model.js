const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cartItemSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [5, "Name must be at least 5 characters"],
    maxLength: [20, "Name must be at most 20 characters"],
  },
  qty: {
    type: Number,
    required: [true, "Qty is required"],
    min: [1, "Qty must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    default: 0,
  },
  image_url: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = model("CartItem", cartItemSchema);
