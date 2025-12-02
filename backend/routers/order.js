const express = require('express');
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const moment = require('moment');
const querystring = require('querystring');
const order = require('../models/order');
require('dotenv').config();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// get all 
router.get('/', async (req, res) => {
  try {
    const order = await Order.find().populate(
      "iduser",
      "name phone address"
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
router.get('/byuser/:userid', async (req, res) => {
  try {
    const userid = req.params.userid;
    const orders = await Order.find({ iduser: userid })
    res.status(200).json(orders);
  } catch (error) {

  }
})

// //get by id
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


// dat hang tien mat
router.post("/  ", async (req, res) => {
  const { iduser, total, items } = req.body
  if (!iduser || !items || !total || items.length === 0) {
    return res.status(400).json("du lieu thieu hoac sai");
  }

  try {
    const order = new Order({
      iduser: iduser,
      items: items,
      total: total,
      paymentmethod: "Paid-Money"
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
    return res.status(500).json({ message: "Lỗi Server " });
  }
});

// cap nhat trang thai don hang 
router.put('/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const today = new Date();
    const updateFields = { status };
    if (status === "completed") {
      updateFields.updatedAt = today; 
    }
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      { $set: updateFields },
      { new: true }
    );
    if (order.paymentmethod === "Pending") {
      return res.status(409).json("Đơn hàng chưa thanh toán")
    }
    if (order) {
      res.status(200).json("Cập nhật thành công")
    }
    else {
      return res.status(404).json("Không tìm thấy đơn hàng");
    }


  } catch (error) {
    console.error("lỗi cập nhật đơn hàng");
    res.status(404).json("lỗi cập nhật ");

  }
});



// dat hang vnpay
router.post('/create_payment_url', async function (req, res, next) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let config = require('config');

  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnpUrl = config.get('vnp_Url');
  let returnUrl = config.get('vnp_ReturnUrl');
  let orderId = moment(date).format('DDHHmmss');
  console.log(orderId);
  let amount = req.body.total;
  console.log(amount);
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
  console.log("dfnjksdbfjksdf----------");
  const { iduser, items, total } = req.body;
  if (!iduser || !items || !total) {
    return res.status(400).json("thieu dữ liệu or sai dữ liệu");
  }
  const order = new Order({
    iduser: iduser,
    items: items,
    total: total
  });
  const savedOrder = await order.save();
  if (!savedOrder) {
    console.log("không lưu được");
    return res.status(400).json("không lưu được đơn hàng");
  }
  vnp_Params['vnp_TxnRef'] = String(savedOrder._id);
  

  vnp_Params = sortObject(vnp_Params);
  console.log(vnp_Params);


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
  vnp_Params = { ...vnp_Params };
  // console.log("o ham vnpay return ", vnp_Params);
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
    const orderId = req.query.vnp_TxnRef;
    const id = new ObjectId(orderId);
    console.log(id);
    const order =await Order.findOneAndUpdate(
      { _id: id },
      { $set: { paymentmethod: "Paid-Bank" } },
      { new: true }
    );

    await Cart.findOneAndUpdate(
      { iduser: order.iduser },
      { $set: { itemcart: [], total: 0 } },
      { new: true }
    );


    // res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
  } else {
    // res.render('success', { code: '97' })
  }
  res.redirect('http://localhost:3000/vnpay_return?' + querystring.stringify(vnp_Params, {
    encode:
      false
  }));
});

router.get('/vnpay_ipn', function (req, res, next) {
  let vnp_Params = req.query;
  vnp_Params = { ...vnp_Params };
  let secureHash = vnp_Params['vnp_SecureHash'];

  let orderId = vnp_Params['vnp_TxnRef'];
  let rspCode = vnp_Params['vnp_ResponseCode'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  let config = require('config');
  let secretKey = config.get('vnp_HashSecret');
  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

  let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) { //kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == "0") { //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == "00") {
            //thanh cong
            //paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            res.status(200).json({ RspCode: '00', Message: 'Success' })
          }
          else {
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.status(200).json({ RspCode: '00', Message: 'Success' })
          }
        }
        else {
          res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' })
        }
      }
      else {
        res.status(200).json({ RspCode: '04', Message: 'Amount invalid' })
      }
    }
    else {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' })
    }
  }
  else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' })
  }
});

router.post('/querydr', function (req, res, next) {

  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();

  let config = require('config');
  let crypto = require("crypto");

  let vnp_TmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnp_Api = config.get('vnp_Api');

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;

  let vnp_RequestId = moment(date).format('HHmmss');
  let vnp_Version = '2.1.0';
  let vnp_Command = 'querydr';
  let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

  let vnp_IpAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let currCode = 'VND';
  let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

  let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

  let dataObj = {
    'vnp_RequestId': vnp_RequestId,
    'vnp_Version': vnp_Version,
    'vnp_Command': vnp_Command,
    'vnp_TmnCode': vnp_TmnCode,
    'vnp_TxnRef': vnp_TxnRef,
    'vnp_OrderInfo': vnp_OrderInfo,
    'vnp_TransactionDate': vnp_TransactionDate,
    'vnp_CreateDate': vnp_CreateDate,
    'vnp_IpAddr': vnp_IpAddr,
    'vnp_SecureHash': vnp_SecureHash
  };
  // /merchant_webapi/api/transaction
  request({
    url: vnp_Api,
    method: "POST",
    json: true,
    body: dataObj
  }, function (error, response, body) {
    console.log(response);
  });

});

router.post('/refund', function (req, res, next) {

  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();

  let config = require('config');
  let crypto = require("crypto");

  let vnp_TmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnp_Api = config.get('vnp_Api');

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;
  let vnp_Amount = req.body.amount * 100;
  let vnp_TransactionType = req.body.transType;
  let vnp_CreateBy = req.body.user;

  let currCode = 'VND';

  let vnp_RequestId = moment(date).format('HHmmss');
  let vnp_Version = '2.1.0';
  let vnp_Command = 'refund';
  let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

  let vnp_IpAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;


  let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

  let vnp_TransactionNo = '0';

  let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

  let dataObj = {
    'vnp_RequestId': vnp_RequestId,
    'vnp_Version': vnp_Version,
    'vnp_Command': vnp_Command,
    'vnp_TmnCode': vnp_TmnCode,
    'vnp_TransactionType': vnp_TransactionType,
    'vnp_TxnRef': vnp_TxnRef,
    'vnp_Amount': vnp_Amount,
    'vnp_TransactionNo': vnp_TransactionNo,
    'vnp_CreateBy': vnp_CreateBy,
    'vnp_OrderInfo': vnp_OrderInfo,
    'vnp_TransactionDate': vnp_TransactionDate,
    'vnp_CreateDate': vnp_CreateDate,
    'vnp_IpAddr': vnp_IpAddr,
    'vnp_SecureHash': vnp_SecureHash
  };

  request({
    url: vnp_Api,
    method: "POST",
    json: true,
    body: dataObj
  }, function (error, response, body) {
    console.log(response);
  });

});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = router;