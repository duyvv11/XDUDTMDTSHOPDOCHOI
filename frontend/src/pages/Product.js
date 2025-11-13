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
  }, []);

  // biến giả lập đăng nhập 
  const userid =localStorage.getItem("userid");
  // thêm sản phẩm vào giỏ
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
    <div className="product-list">
      <h2>Tất cả sản phẩm</h2>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-item" key={p._id}>
              <Link to={`/product/${p._id}`}>
                <img src={p.imageproducts} alt={p.name} />
              </Link>
              <h4>{p.name}</h4>
              <p className="product-descreption">{p.description}</p>
              <h5>Thương hiệu : {p.brandid.name}</h5>
              <p><b>{p.price} đ</b></p>
              <button className="btn-add-cart btn-use" onClick={()=>handleAddToCart(p._id)}>Thêm vào giỏ</button>
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