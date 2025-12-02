import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ProductDetail.css';
function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const userid = localStorage.getItem("userid");

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.log(err));
  }, [id]);
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

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="product-detail">
      <img src={product.imageproducts[0]} alt={product.name} />

      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <h5>Thương hiệu: {product.brandid?.name}</h5>
        <p>Số lượng: {product.quantity}</p>
        <p>Danh mục: {product.categoryid?.name}</p>
        <p><b>Giá: {product.price} đ</b></p>
        <button className="btn-add-cart btn-use"
          onClick={() => handleAddToCart(product._id)}>
          Thêm vào giỏ
        </button>
      </div>
      <div className="image-product">
        {product.imageproducts.map((img)=>{
          return (
            <div className="img-list">
              <img src={img} alt="anh san pham"></img>
            </div>
          )
        })}

      </div>
    </div>
  );
}

export default ProductDetail;
