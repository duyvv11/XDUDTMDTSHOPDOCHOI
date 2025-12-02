import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

function SearchResult() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  // Lấy query param từ URL
  const query = new URLSearchParams(location.search).get('query') || "";
  const userid = localStorage.getItem("userid");
  useEffect(() => {
    fetch('http://localhost:5000/api/product')
      .then(res => res.json())
      .then(data => {
        // filter sản phẩm theo tên, thương hiệu hoặc danh mục
        const filtered = data.filter(p => {
          const nameMatch = p.name.toLowerCase().includes(query.toLowerCase());
          const brandMatch = p.brandid?.name?.toLowerCase().includes(query.toLowerCase());
          const categoryMatch = p.categoryid?.name?.toLowerCase().includes(query.toLowerCase());
          return nameMatch || brandMatch || categoryMatch;
        });
        setProducts(filtered);
      })
      .catch(err => console.log(err));
  }, [query]);
  const handleAddToCart = async (productid) => {
    try {
      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, productid, quantity: 1 })
      });
      const data = await res.json();
      alert(data.msg);
    } catch (err) {
      console.log(err);
      alert("Lỗi khi thêm vào giỏ hàng");
    }
  };

  return (
    <div className="product-list">
      <h2>Kết quả tìm kiếm: "{query}"</h2>

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
              <span><b>{p.price} đ</b></span>
              <p><b>{p.price} đ</b></p>
              <button className="btn-add-cart btn-use"
                onClick={() => handleAddToCart(p._id)}>
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có sản phẩm nào</p>
      )}
    </div>
  )
}

export default SearchResult;
