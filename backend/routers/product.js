const Product = require("../models/products")
var express = require('express');
var router = express.Router();
//get all product
router.get('/', async (req, res) => {
  {
    const product = await Product.find()
    .populate('brandid')
    .populate('categoryid');
    res.json(product);
  }
})
//lay chi tiet san pham
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id)
      .select('name description imageproducts price quantity soldout danhgia')
      .populate('brandid','name')
      .populate('categoryid','name');

    if (!product) {
      return res.status(404).json({ msg: 'Không tìm thấy sản phẩm' });
    }

  
    let averageStar = 0;
    if (product.danhgia && product.danhgia.length > 0) {
      const totalStars = product.danhgia.reduce((sum, dg) => sum + (dg.totalstart || 0), 0);
      averageStar = totalStars / product.danhgia.length;
    }

    res.json({
      ...product.toObject(),
      averageStar: Number(averageStar.toFixed(1))
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
// //them san pham moi
// router.post('/', (req, res) => {

// })
// //xoa san pham
// router.delete('/:id', () => {

// })
// // cap nhat
// router.put('/:id', () => {

// })
// Lấy tất cả sản phẩm theo id danh mục
router.get('/category/:categoryId', async (req, res) => {
  try {

    const products = await Product.find({ categoryid: req.params.categoryId })
      .select('name description imageproducts price quantity ')
      .populate('brandid','name');
    console.log(products)
      const result = products.map(p=>({
        ...p,
        firt_image: p.imageproducts[0]
      }))
      console.log(result);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
