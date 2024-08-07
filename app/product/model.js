const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minLength: [3, "Product name must be at least 3 characters"],
    },
    description: {
      type: String,
      maxLength: [100, "Product description must be at most 100 characters"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
