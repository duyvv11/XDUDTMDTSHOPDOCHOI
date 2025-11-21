import './Category.css'
import './Product.css'
import { useState, useEffect } from 'react';

function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);

  // Lấy danh sách brand
  useEffect(() => {
    fetch('http://localhost:5000/api/brand/')
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.log(err));
  }, []);

  // Khi click chọn brand
  const handleCategoryClick = (id) => {
    setSelectedBrand(id);
    fetch(`http://localhost:5000/api/product/brand/${id}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  };

  return (
    <div className="category-container">
      <h2>Thương Hiệu</h2>
      <div className="category-list">
        {brands.map((br) => (
          <div
            className={`category-item ${selectedBrand === br._id ? 'active' : ''}`}
            key={br._id}
            onClick={() => handleCategoryClick(br._id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={br.logobrand} alt={br.name} />
            <h3>{br.name}</h3>
            <p>{br.description}</p>
          </div>
        ))}
      </div>

      {selectedBrand && (
        <div className="product-list">
          <h2>Sản Phẩm Thuộc Thương Hiệu</h2>
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
            <p>Không có sản phẩm nào của thương hiệu này.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default BrandPage;