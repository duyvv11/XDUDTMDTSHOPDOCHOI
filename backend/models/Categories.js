const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  imagecategories: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', categorySchema);
