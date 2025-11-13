const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  imagecategories: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
