const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bycrypt = require("bcrypt");

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      minLength: [3, "Full name must be at least 3 characters"],
      maxLength: [20, "Full name must be at most 20 characters"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxLength: [20, "Email must be at most 20 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.path("email").validate(
  function (value) {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(value);
  },
  (attr) => `${attr.value} Invalid email format`
);

userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").countDocuments({ email: value });
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} already exists`
);

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bycrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchema);
