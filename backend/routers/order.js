const express = require('express');
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
// get all 
router.get('/', async (req, res) => {
  const order = await Order.find();
  res.json(order);

})
// get by user

// get by id
router.get('/:orderId', async (req, res) => {
  try {
    console.log("nhận api get detail don hang")
    const id = req.params.orderId;
    const populatedOrder = await Order.findById(id)
      .populate({
        path: 'items.idproduct',
        select: 'name '
      })
      .exec();
    return res.status(200).json(populatedOrder);
    
  } catch (error) {
    return res.status(500).json("lỗi sever");
    
  }

})


// dat hang
router.post("/", async (req, res) => {
  // console.log("đặt hàng");
  const { iduser, items, total } = req.body;
  // console.log(iduser, items, total);

  if (!iduser || !items || !total || items.length === 0) {
    return res.status(400).json("du lieu thieu hoac sai");
  }

  try {
    const order = new Order({
      iduser: iduser,
      items: items.map(i => ({
        idproduct: i.idproduct,
        quantity: i.quantity
      })),
      total: total,
    });

    const savedOrder = await order.save();

    await Cart.findOneAndUpdate(
      { iduser: iduser },
      { $set: { itemcart: [], total: 0 } },
      { new: true }
    );

    return res.status(201).json({
      message: "Tạo đơn hàng thành công và giỏ hàng đã được làm rỗng.",
      order: savedOrder
    });

  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return res.status(500).json({ message: "Lỗi Server nội bộ khi xử lý đơn hàng." });
  }
});
module.exports = router;