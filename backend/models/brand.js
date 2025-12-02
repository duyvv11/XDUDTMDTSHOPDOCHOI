const mongoose = require("mongoose");
const { Schema } = mongoose;
const brandSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  logobrand: { type: String },
  country: { type: String },
  yoe: { type: Number }
  },
  { timestamps: true }
)
module.exports = mongoose.model('Brand', brandSchema);