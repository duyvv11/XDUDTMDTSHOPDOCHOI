const mongoose = require("mongoose");
const { Schema } = mongoose;
const brandSchema = new Schema({
  name: { type: String, required: true },
  descreption: { type: String },
  logobrand: { type: String },
  country: { type: String },
  yoe: { type: Number },
  createdAt: { type: Date },
})
module.exports = mongoose.model('Brand', brandSchema);