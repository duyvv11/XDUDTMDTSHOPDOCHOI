const mongoose = require("mongoose");
const { Schema } = mongoose;
const cartSchema = new mongoose.Schema({
  iduser: { type: Schema.Types.ObjectId, ref: 'User' },
  itemcart: [{
    idproduct: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  total: { type: Number },

  },
  { timestamps: true }

)
module.exports =mongoose.model ('cart', cartSchema);