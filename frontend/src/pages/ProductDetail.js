import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ProductDetail.css';
import { FaStar } from 'react-icons/fa';
function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.log(err));
  }, [id]);

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="product-detail">
      <img src={product.imageproducts} alt={product.name} />

      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <h5>Thương hiệu: {product.brandid?.name}</h5>
        <p>Số lượng: {product.quantity}</p>
        <p>Danh mục: {product.categoryid?.name}</p>
        <p>Đã bán :{product.soldout}</p>
        <p><b>Giá: {product.price} đ</b></p>
        <p>Đánh giá: {product.averageStar} <FaStar/> </p>
        <button>Thêm vào giỏ hàng</button>
      </div>
    </div>
  );
}

export default ProductDetail;
