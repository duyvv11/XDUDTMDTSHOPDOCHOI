const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  iduser: { type: Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      idproduct: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    }
  ],
  total: { type: Number, required: true },
  // Trạng thái đơn hàng
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
    default: "pending"
  },
  paymentmethod:{
    type:String,
    enum :["Pending","Paid"],
    default:'Pending'
  },


}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
