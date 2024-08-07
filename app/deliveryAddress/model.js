const { Schema, model } = require("mongoose");

const deliveryAddressSchema = new Schema(
  {
    nama: {
      type: String,
      required: [true, "Full name is required"],
      minLength: [3, "Full name must be at least 3 characters"],
      maxLength: [20, "Full name must be at most 20 characters"],
    },
    kelurahan: {
      type: String,
      required: [true, "Kelurahan is required"],
      minLength: [3, "Kelurahan must be at least 3 characters"],
      maxLength: [20, "Kelurahan must be at most 20 characters"],
    },
    kecamatan: {
      type: String,
      required: [true, "Kecamatan is required"],
      minLength: [3, "Kecamatan must be at least 3 characters"],
      maxLength: [20, "Kecamatan must be at most 20 characters"],
    },
    kabupaten: {
      type: String,
      required: [true, "Kabupaten is required"],
      minLength: [3, "Kabupaten must be at least 3 characters"],
      maxLength: [20, "Kabupaten must be at most 20 characters"],
    },
    provinsi: {
      type: String,
      required: [true, "Provinsi is required"],
      minLength: [3, "Provinsi must be at least 3 characters"],
      maxLength: [20, "Provinsi must be at most 20 characters"],
    },
    detail: {
      type: String,
      required: [true, "Detail is required"],
      minLength: [3, "Detail must be at least 3 characters"],
      maxLength: [50, "Detail must be at most 50 characters"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);
