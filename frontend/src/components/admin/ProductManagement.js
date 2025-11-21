import React, { useState, useEffect } from 'react';

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: '#e0e5ec',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
  width: '600px',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const modalHeaderStyle = {
  fontSize: '1.8em',
  fontWeight: '700',
  color: '#d90429',
  marginBottom: '20px',
  borderBottom: '2px solid #d90429',
  paddingBottom: '10px',
};



const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State mới cho modal (pop-up)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Thêm mới, object = Sửa

  // State để lưu danh sách brand/category cho dropdown
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // === CÁC HÀM GỌI API ===

  // 1. Tải tất cả sản phẩm (GET /api/product)
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/product/'); 
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
    setIsLoading(false);
  };

  // 2. Tải tất cả thương hiệu (GET /api/brand)
  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/brand');
      const data = await response.json();
      if (Array.isArray(data)) setBrands(data);
    } catch (error) {
      console.error("Lỗi khi tải thương hiệu:", error);
    }
  };

  // 3. Tải tất cả danh mục (GET /api/category)
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/category/');
      const data = await response.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  // 4. Xử lý XÓA (DELETE /api/product/:id)
  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        const response = await fetch(`/api/product/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert("Xóa thành công!");
          fetchProducts(); // Tải lại danh sách
        } else {
          alert("Xảy ra lỗi khi xóa.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  // 5. Xử lý LƯU (Thêm mới hoặc Sửa)
  const handleSave = async (productData) => {
    const isEditing = !!productData._id; // Kiểm tra xem đây là sửa hay thêm mới
    const url = isEditing ? `http://localhost:5000/api/product/${productData._id}` : 'http://localhost:5000/api/product/';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        closeModal();
        fetchProducts(); // Tải lại danh sách
      } else {
        const errData = await response.json();
        alert(`Lỗi: ${errData.msg || 'Xảy ra lỗi'}`);
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    }
  };

  // === CÁC HÀM ĐIỀU KHIỂN MODAL ===

  // Mở modal để THÊM MỚI
  const openAddModal = () => {
    setEditingProduct({}); // Đặt state là object rỗng
    setIsModalOpen(true);
  };

  // Mở modal để SỬA
  const openEditModal = (product) => {
    // Cần lấy ID thay vì object
    const productToEdit = {
      ...product,
      brandid: product.brandid._id,
      categoryid: product.categoryid._id
    };
    setEditingProduct(productToEdit);
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Tải dữ liệu lần đầu
  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, []);

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h2>Quản lý Sản phẩm</h2>
        <button className="admin-btn" onClick={openAddModal}>Thêm sản phẩm mới</button>
      </div>
      
      {/* Bảng sản phẩm */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Thương hiệu</th>
              <th>Kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}> 
                <td>{product.name}</td>
                <td>{product.price ? product.price.toLocaleString('vi-VN') : 0} đ</td>
                <td>{product.brandid ? product.brandid.name : 'Không có'}</td>
                <td>{product.quantity}</td>
                <td className="action-buttons">
                  <button onClick={() => openEditModal(product)} className="admin-btn-edit">Sửa</button>
                  <button onClick={() => handleDelete(product._id)} className="admin-btn-delete">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL (POP-UP) ĐỂ THÊM/SỬA */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          brands={brands}
          categories={categories}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// === COMPONENT MODAL FORM (VIẾT CÙNG FILE CHO TIỆN) ===
const ProductFormModal = ({ product, brands, categories, onClose, onSave }) => {
  // State riêng cho form
  const [formData, setFormData] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Xử lý khi nhấn nút Lưu (trên form)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Chuyển đổi giá và số lượng về dạng số
    const dataToSave = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    };
    onSave(dataToSave);
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          {product._id ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Tên sản phẩm */}
          <div className="admin-form-group">
            <label>Tên sản phẩm</label>
            <input
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </div>
          
          {/* Giá */}
          <div className="admin-form-group">
            <label>Giá (VND)</label>
            <input
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </div>
          
          {/* Số lượng */}
          <div className="admin-form-group">
            <label>Số lượng</label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity || ''}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </div>
          
          {/* Thương hiệu (Dropdown) */}
          <div className="admin-form-group">
            <label>Thương hiệu</label>
            <select
              name="brandid"
              value={formData.brandid || ''}
              onChange={handleChange}
              className="admin-input" // Dùng chung style 'admin-input'
              required
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map(brand => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>
          </div>
          
          {/* Danh mục (Dropdown) */}
          <div className="admin-form-group">
            <label>Danh mục</label>
            <select
              name="categoryid"
              value={formData.categoryid || ''}
              onChange={handleChange}
              className="admin-input"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          {/* Mô tả */}
          <div className="admin-form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="admin-input" // Dùng chung style 'admin-input'
              rows="4"
            ></textarea>
          </div>
          
          {/* Nút bấm */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="admin-btn" onClick={onClose} style={{ background: '#555' }}>
              Hủy
            </button>
            <button type="submit" className="admin-btn">
              {product._id ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;