const mongoose = require("mongoose");
const { Schema } = mongoose;
const newSchema = new mongoose.Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagenew: { type: String }
}, { timestamps: true })
module.exports = mongoose.model('News', newSchema);