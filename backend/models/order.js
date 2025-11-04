const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  paymethod: { type: String, required: true },
  total: { type: Number, required: true },
  status: { type: String, required: true, default: 'chờ xác nhận' },
  reviewedby: { type: Schema.Types.ObjectId, ref: 'Users' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  User: { type: Schema.Types.ObjectId, ref: 'Users' },
})
module.exports = mongoose.model('Order', orderSchema); 