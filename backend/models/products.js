const mongoose = require("mongoose")
const { Schema } = mongoose;
const productSchema = new Schema({
  name: { type: String, required: true },
  categoryid: { type: Schema.Types.ObjectId, ref: 'Category' },
  description: { type: String },
  imageproducts:[String],
  price: { type: Number },
  quantity: { type: Number },
  soldout: { type: Number },
  brandid: { type: Schema.Types.ObjectId, ref: 'Brand' }
}, { timestamps: true })
module.exports = mongoose.model('Product', productSchema);