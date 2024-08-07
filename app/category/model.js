const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const categorySchema = Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    minLength: [3, "Category name must be at least 3 characters"],
    maxLength: [20, "Category name must be at most 20 characters"],
  },
});

module.exports = model("Category", categorySchema);
