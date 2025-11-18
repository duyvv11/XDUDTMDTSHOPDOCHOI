const Product = require("../models/products")
var express = require('express');
var router = express.Router();

// GET - Lấy tất cả sản phẩm (Bạn đã có)
router.get('/', async (req, res) => {
  try {
    const product = await Product.find()
      .populate('brandid')
      .populate('categoryid');
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET - Lấy chi tiết 1 sản phẩm (Bạn đã có)
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

// GET - Lấy sản phẩm theo category (Bạn đã có)
router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ categoryid: req.params.categoryId })
      .select('name description imageproducts price quantity ')
      .populate('brandid','name');
    
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ===============================================
// === BẮT ĐẦU CODE MỚI CHO THÊM, SỬA, XÓA ===
// ===============================================

// POST - Thêm sản phẩm mới
// API: POST /api/product
router.post('/', async (req, res) => {
  try {
    // Lấy dữ liệu từ body
    const { 
      name, 
      description, 
      price, 
      quantity, 
      brandid, 
      categoryid,
      imageproducts // Đây nên là một mảng các URL hình ảnh
    } = req.body;

    // Kiểm tra dữ liệu cơ bản
    if (!name || !price || !brandid || !categoryid) {
      return res.status(400).json({ msg: 'Vui lòng nhập các trường bắt buộc: Tên, Giá, Thương hiệu, Danh mục' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      brandid,
      categoryid,
      imageproducts: imageproducts || [] // Đảm bảo imageproducts là mảng
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ msg: "Thêm sản phẩm thành công!", product: savedProduct });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// PUT - Cập nhật (Sửa) sản phẩm
// API: PUT /api/product/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Lấy dữ liệu cần cập nhật từ body
    const { 
      name, 
      description, 
      price, 
      quantity, 
      brandid, 
      categoryid,
      imageproducts
    } = req.body;

    // Tìm sản phẩm và cập nhật
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        quantity,
        brandid,
        categoryid,
        imageproducts
      },
      { new: true } // {new: true} để trả về sản phẩm sau khi đã cập nhật
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: 'Không tìm thấy sản phẩm để cập nhật' });
    }

    res.status(200).json({ msg: "Cập nhật sản phẩm thành công!", product: updatedProduct });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// DELETE - Xóa sản phẩm
// API: DELETE /api/product/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ msg: 'Không tìm thấy sản phẩm để xóa' });
    }

    res.status(200).json({ msg: 'Xóa sản phẩm thành công!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});


module.exports = router;