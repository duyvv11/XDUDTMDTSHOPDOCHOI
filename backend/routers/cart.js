const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const { findOneAndUpdate } = require('../models/brand');

router.post("/add", async (req, res) => {
  try {
    const { userid: iduser, productid: idproduct, quantity } = req.body;
    // // console.log(".......", idproduct);
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
    const cartbyUser = await Cart.findOne({ iduser: userid }).populate('itemcart.idproduct', 'name price imageproducts')
    if (cartbyUser) {
      return res.status(200).json(cartbyUser);
    }
    else return res.status(200).json("")

  } catch (error) {
    console.log("không lấy được giỏ hàng", error)

  }

})

// cap nhat so luon san pham trong gio hàng
router.put("/updatequantity", async (req, res) => {
  console.log("update quantitydfdgdfgd");
  try {
    const { userid, productid, quantity } = req.body;
    const updateCart = await Cart.findOneAndUpdate(
      {
        iduser: userid,
        "itemcart.idproduct": productid
      },
      {
        $set: { "itemcart.$.quantity": quantity }
      }
    );
    if (!updateCart) {
      return res.status(404).json("không tìm thấy giỏ hàng");
    }
    else {
      return res.status(200).json("cập nhật số lượng thành công");
    }
  }
  catch {
    return res.status(500).json("lỗi server");
  }
})

module.exports = router;