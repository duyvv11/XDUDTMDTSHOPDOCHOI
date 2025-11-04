import './Category.css'
import './Product.css'
import { useState, useEffect } from 'react';

function Category() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  // Lấy danh sách category
  useEffect(() => {
    fetch('http://localhost:5000/api/category')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.log(err));
  }, []);

  // Khi click chọn category
  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
    fetch(`http://localhost:5000/api/product/category/${id}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  };

  return (
    <div className="category-container">
      <h2>Danh Mục Sản Phẩm</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <div
            className={`category-item ${selectedCategory === cat._id ? 'active' : ''}`}
            key={cat._id}
            onClick={() => handleCategoryClick(cat._id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={cat.imagecategories} alt={cat.name} />
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="product-list">
          <h2>Sản Phẩm Thuộc Danh Mục</h2>
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((p) => (
                <div className="product-item" key={p._id}>
                  <img src={p.imageproducts} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                  <h5>Thương hiệu : {p.brandid.name}</h5>
                  <p><b>{p.price} đ</b></p>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có sản phẩm nào trong danh mục này.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Category;
