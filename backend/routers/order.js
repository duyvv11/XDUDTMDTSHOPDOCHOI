const express = require('express');
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const moment = require('moment');
const querystring = require('querystring');
require('dotenv').config();


// get all 
router.get('/', async (req, res) => {
  try {
    const order = await Order.find().populate(
      "iduser",
      "name phone address"
    ).populate(
      "items.idproduct",
      "name"
    )
    if (!order) {
      return res.status(404).json("Không tìm thấy đơn hàng");
    }
    else {
      res.status(200).json(order);
    } 
  } catch (error) {
    res.status(500).json("lỗi sever");
    
  }


})
// get by user

// get by id
// router.get('/:orderId', async (req, res) => {
//   try {
//     console.log("nhận api get detail don hang")
//     const id = req.params.orderId;
//     const populatedOrder = await Order.findById(id)
//       .populate({
//         path: 'items.idproduct',
//         select: 'name '
//       })
//       .exec();
//     return res.status(200).json(populatedOrder);
    
//   } catch (error) {
//     return res.status(500).json("lỗi sever");
    
//   }

// })


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

// cap nhat trang thai don hang 
router.put ('/:orderId' ,async (req,res) =>{
  try {
    const {status} = req.body;
    if(status === "completed"){
      
    }
    const order = await Order.findOneAndUpdate(
      {_id:req.params.orderId},
      {$set :{status:status}},
      {new:true}
    );
    if(order.paymentmethod === "Pending"){
      return res.status(409).json("Đơn hàng chưa thanh toán")
    }
    if(order){
      res.status(200).json("Cập nhật thành công")
    }
    else{
      return res.status(404).json("Không tìm thấy đơn hàng");
    }
    
    
  } catch (error) {
    console.error("lỗi cập nhật đơn hàng");
    res.status(404).json("lỗi cập nhật ");
    
  }
});

// thanh toán VN PAY
// router.post('/thanhtoanvnpay', function (req, res) {
//   try {
//     const ipAddr =
//       req.headers["x-forwarded-for"] ||
//       req.connection.remoteAddress ||
//       req.socket.remoteAddress;

//     const tmnCode = process.env.VNPTMNCODE;
//     const secretKey = process.env.VNPHASHSECRET;
//     const vnpUrl = process.env.VNPURL;

//     const returnUrl = "http://localhost:3000/order/vnpay_return";

//     let date = new Date();

//     let createDate = moment(date).format("YYYYMMDDHHmmss");
//     let orderId = moment(date).format("HHmmss");

//     let amount = req.body.amount;
//     let bankCode = req.body.bankCode;

//     let orderInfo = req.body.orderDescription;
//     let orderType = req.body.orderType;
//     let locale = req.body.language || "vn";

//     let currCode = "VND";
//     let vnp_Params = {};

//     vnp_Params["vnp_Version"] = "2.1.0";
//     vnp_Params["vnp_Command"] = "pay";
//     vnp_Params["vnp_TmnCode"] = tmnCode;
//     vnp_Params["vnp_Locale"] = locale;
//     vnp_Params["vnp_CurrCode"] = currCode;
//     vnp_Params["vnp_TxnRef"] = orderId;
//     vnp_Params["vnp_OrderInfo"] = orderInfo;
//     vnp_Params["vnp_OrderType"] = orderType;
//     vnp_Params["vnp_Amount"] = amount * 100;
//     vnp_Params["vnp_ReturnUrl"] = returnUrl;
//     vnp_Params["vnp_IpAddr"] = ipAddr;
//     vnp_Params["vnp_CreateDate"] = createDate;

//     if (bankCode) {
//       vnp_Params["vnp_BankCode"] = bankCode;
//     }

//     vnp_Params = sortObject(vnp_Params);

//     const querystring = require("querystring");

//     let signData = querystring.stringify(vnp_Params, { encode: false });

//     let hmac = crypto.createHmac("sha512", secretKey);
//     let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//     vnp_Params["vnp_SecureHash"] = signed;

//     let paymentUrl =
//       vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });

//     console.log("Redirect URL:", paymentUrl);

//     res.redirect(paymentUrl);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Lỗi thanh toán VNPAY");
//   }
// });

//
router.post('/create_payment_url', async function (req, res, next) {
  console.log("nhận roter thanh toan vnpay")
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');
  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  let tmnCode = process.env.VNPTMNCODE;
  let secretKey = process.env.VNPHASHSECRET;
  let vnpUrl = process.env.VNPURL;
  let returnUrl = process.env.RETURNURL;
  let orderId = moment(date).format('DDHHmmss');
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (locale === null || locale === '') {
    locale = 'vn';
  }
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  // 1. Lấy giỏ hàng  
  const { iduser } = req.body;
  const cart = await Cart.findOne({ iduser: iduser });
  console.log(cart);
  console.log(iduser);

  // 2. Tính tổng tiền 
  const totalAmount = cart.itemcart.reduce((sum, item) => sum + item.idproduct.price * item.quantity, 0);

  // 3. Tạo đơn hàng mới 
  const newOrder = {
    iduser: cart.iduser,
    items: cart.itemcart.map(item => ({
      idproduct: item.idproduct,
      name: item.idproduct.name,
      price: item.idproduct.price,
      quantity: item.quantity
    })), 
    status: "pending",
    total: totalAmount,
    created_at: new Date()
  };
  const result = await Order.insertOne(newOrder);

  // cap nhat lai order id 
  if (result) {
    vnp_Params['vnp_TxnRef'] = String(result.insertedId);
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  // res.redirect(vnpUrl) 
  res.json({ paymentUrl: vnpUrl });
});

router.get('/vnpay_return', async function (req, res, next) {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let config = require('config');
  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua 

    // Cap nhat lai status của order 
    const database = await db();

    const orderId = req.query.vnp_TxnRef;
    const _id = new ObjectId(orderId);

    const order = await database.collection("orders").findOne({ _id });

    if (order) {
      await database.collection("orders").updateOne(
        { _id },
        { $set: { status: 1 } } // đã thanh toán 
      );

      // Xóa dữ liệu giỏ hàng 
      const user_id = order.user_id;
      await database.collection("cart").deleteOne({ user_id: user_id })
    }

    // res.render('success', { code: vnp_Params['vnp_ResponseCode'] }) 

  } else {
    // res.render('success', { code: '97' }) 
  }
  res.redirect('http://localhost:3000/vnpay_return?' + querystring.stringify(vnp_Params, {
    encode:
      false
  }));
});
module.exports = router;