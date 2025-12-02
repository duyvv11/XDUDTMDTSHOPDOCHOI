import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import './Product.css'

function Product() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    fetch('http://localhost:5000/api/product')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  const userid = localStorage.getItem("userid");

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

  // phan trang
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="product-list">
      <h2>Tất cả sản phẩm</h2>

      {products.length > 0 ? (
        <>
          <div className="product-grid">
            {currentProducts.map((p) => (
              <div className="product-item" key={p._id}>
                <Link to={`/product/${p._id}`}>
                  <img src={p.imageproducts[0]} alt={p.name} />
                </Link>
                <h4>{p.name}</h4>
                <p className="product-descreption">{p.description}</p>
                <h5>Thương hiệu : {p.brandid.name}</h5>
                <h5>Danh mục : {p.categoryid.name}</h5>
                <span><b>{p.price} đ</b></span>
                <button className="btn-add-cart btn-use"
                  onClick={() => handleAddToCart(p._id)}>
                  Thêm vào giỏ
                </button>
              </div>
            ))}
          </div>

          {/*Nút phân trang */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>Không có sản phẩm</p>
      )}
    </div>
  )
}

export default Product;
