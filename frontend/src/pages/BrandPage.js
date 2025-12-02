import './Category.css'
import './Product.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const userid = localStorage.getItem("userid");
  // lấy danh sách brand
  useEffect(() => {
    fetch('http://localhost:5000/api/brand/')
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.log(err));
  }, []);

  // lhi click chọn brand
  const handleCategoryClick = (id) => {
    setSelectedBrand(id);
    fetch(`http://localhost:5000/api/product/brand/${id}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  };
  const handleAddToCart = async (productid) => {
    try {
      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userid,
          productid,
          quantity: 1
        })
      });
      const data = await res.json();
      alert(data.msg);
    } catch (err) {
      console.log(err);
      alert("Lỗi khi thêm vào giỏ hàng");
    }
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
          <h2>Sản phẩm thuộc thương hiệu</h2>
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((p) => (
                <div className="product-item" key={p._id}>
                  <Link to={`/product/${p._id}`}>
                    <img src={p.imageproducts[0]} alt={p.name} />
                  </Link>
                  <h4>{p.name}</h4>
                  <p className="product-descreption">{p.description}</p>
                  <h5>Thương hiệu : {p.brandid.name}</h5>
                  <h5>Danh mục : {p.categoryid.name}</h5>
                  <span><b>{p.price} đ</b></span>
                  <button className="btn-add-cart btn-use" onClick={() => handleAddToCart(p._id)}>Thêm vào giỏ</button>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có sản phẩm</p>
          )
          }
        </div>
      )}
    </div>
  );
}

export default BrandPage;