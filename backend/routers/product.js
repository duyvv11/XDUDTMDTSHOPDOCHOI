const Product = require("../models/products")
var express = require('express');
var router = express.Router();

// get all
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

// get detail
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

// láy sản phẩm theo danh mục
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

// lấy sản phẩm theo thương hiệu 
router.get ("/brand/:brandId" , async (req,res)=>{
  try {
    console.log(req.params.brandId);
    const products = await Product.find({brandid:req.params.brandId})
      // .select('name description imageproducts price quantity ')
      // .populate('categoryid', 'name');
    res.status(200).json(products);
    
  } catch (error) {
    res.status(500).json("lỗi sever", error.message);
    
  }


})
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