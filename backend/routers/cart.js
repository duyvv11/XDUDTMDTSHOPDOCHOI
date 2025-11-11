const express = require('express');
const router = express.Router();
const Cart = require('../models/cart')

router.post("/add", async (req, res) => {
  try {
    const { userid: iduser, productid: idproduct, quantity } = req.body;
    // console.log(".......", idproduct);
    const cartByUser = await Cart.findOne({ iduser: iduser });
    // console.log("cartbyuser",cartByUser);
    if (cartByUser) {
      const existingItem = cartByUser.itemcart.find((item) => {
        return item.idproduct?.toString() === idproduct
      })
      if (existingItem) {
        existingItem.quantity += quantity;
      }
      else {
        cartByUser.itemcart.push({
          idproduct: idproduct,
          quantity: quantity
        })
      }
      await cartByUser.save()
      return res.status(200).json({ msg: "thêm vào giỏ hàng thành công", cart: cartByUser });

    }
    else {
      const newCart = await Cart.create({
        iduser: iduser,
        itemcart: [{
          idproduct: idproduct,
          quantity: quantity
        }]
      })
      await newCart.save();
      return res.status(200).json({ msg: "tạo giỏ hàng lần đầu cho user ", cart: newCart });
    }


  } catch (error) {
    console.log("lỗi api add cart", error)
  }

})
// get giỏ hàng cho user 
router.get("/:id", async (req, res) => {
  try {
    const userid = req.params.id;
    console.log(userid);
    const cartbyUser = await Cart.findOne({ iduser: userid }).populate('itemcart.idproduct','name price imageproducts')

    console.log("gio hang",cartbyUser);
    if (cartbyUser) {
      return res.status(200).json(cartbyUser);
    }
    else return res.status(200).json("")

  } catch (error) {
    console.log("không lấy được giỏ hàng", error)

  }

})
module.exports = router;