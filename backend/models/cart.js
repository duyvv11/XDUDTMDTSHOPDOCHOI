const mongoose = require("mongoose");
const { Schema } = mongoose;
const cartSchema = new mongoose.Schema({
  iduser: { type: Schema.Types.ObjectId, ref: 'User' },
  itemcart: [{
    idproduct: { type: Schema.Types.ObjectId, ref: 'Product' },
  }],
  total: { type: Number },

})
module.exports = ('cart', cartSchema);