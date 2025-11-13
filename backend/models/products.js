const mongoose = require("mongoose")
const { Schema } = mongoose;
const productSchema = new Schema({
  name: { type: String, required: true },
  categoryid: { type: Schema.Types.ObjectId, ref: 'Category' },
  description: { type: String },
  imageproducts:[String],
  price: { type: Number },
  quantity: { type: Number },
  danhgia: [{
    totalstart: { type: Number },
    comment: { type: String }
  }
  ],
  soldout: { type: Number },
  brandid: { type: Schema.Types.ObjectId, ref: 'Brand' }
}, { timestamps: true })
module.exports = mongoose.model('Product', productSchema);