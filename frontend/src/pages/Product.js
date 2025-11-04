import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import './Product.css'
function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/product')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, [])
  return (
    <div className="product-list">
      <h2>Tất cả sản phẩm</h2>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-item" key={p._id}>
              <Link to={`/product/${p._id}`}>
                <img src={p.imageproducts} alt={p.name} />
                <h4>{p.name}</h4>
              </Link>
              <p>{p.description}</p>
              <h5>Thương hiệu : {p.brandid.name}</h5>
              <p><b>{p.price} đ</b></p>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có sản phẩm</p>
      )
      }
    </div>
  )

}
export default Product;