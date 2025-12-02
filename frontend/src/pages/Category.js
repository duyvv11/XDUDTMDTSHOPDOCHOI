import './Category.css'
import './Product.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
function Category() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const userid = localStorage.getItem("userid");
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
          <h2>Sản phẩm thuộc danh mục</h2>
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

export default Category;
