const mongoose = require("mongoose");

// Define beer schema
const beerSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter name"] },
    type: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    ratings: [Number],
  },
  {
    timestamps: true,
  }
);

// Create beer model
const Beer = mongoose.model("Beer", beerSchema);

module.exports = Beer;
