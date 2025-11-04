const Product = require("../models/products")
var express = require('express');
var router = express.Router();
//get all product
router.get('/', async (req, res) => {
  {
    const product = await Product.find().populate('brandid').populate('categoryid');
    // console.log(await Product.find().populate('brandid'));
    // console.log(await Product.find().populate('categoryid'));
    // console.log(product);

    const productResult = product.map(p => ({
      name: p.name,
      description: p.description,
      imageproducts: p.imageproducts,
      price: p.price,
      quantity: p.quantity,
      danhgia: p.danhgia,
      stock: p.stock,
      sold: p.sold,
      brand: p.name,
      categoryid: p.categoryid.name
    }
    ))
    res.json(productResult);
  }
})
//lay chi tiet san pham
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  res.json(product);
})
// //them san pham moi
// router.post('/', (req, res) => {

// })
// //xoa san pham
// router.delete('/:id', () => {

// })
// // cap nhat
// router.put('/:id', () => {

// })
module.exports = router;
