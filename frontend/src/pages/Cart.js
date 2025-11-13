import { useEffect, useState } from "react";
import './CartPage.css';

// const USER_ID = "691344a079b20d6f544a3249";
const USER_ID = localStorage.getItem("userid");

function CartPage() {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCartData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${USER_ID}`);
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    // Optimistic update
    setCart(prevCart => ({
      ...prevCart,
      itemcart: prevCart.itemcart.map(item =>
        item.idproduct._id === productId ? { ...item, quantity: newQuantity } : item
      ),
    }));

    try {
      const res = await fetch(`http://localhost:5000/api/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: USER_ID, productid: productId, quantity: newQuantity }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
    } catch (error) {
      console.error(error);
      fetchCartData(); 
    }
  };

  if (isLoading) return <div className="cart-container">Đang tải giỏ hàng...</div>;
  if (!cart?.itemcart?.length) return <div className="cart-container"><h1>Giỏ hàng</h1><p>Giỏ hàng trống.</p></div>;

  const totalAmount = cart.itemcart.reduce((total, item) => total + item.idproduct.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Giỏ hàng </h2>
      {cart.itemcart.map(item => (
        <div key={item._id} className="cart-item">
          {item.idproduct.imageproducts?.[0] && <img src={item.idproduct.imageproducts[0]} alt={item.idproduct.name} className="item-image" />}
          <div className="item-details">
            <h3>{item.idproduct.name}</h3>
            <p>Giá: {item.idproduct.price.toLocaleString('vi-VN')} đ</p>
          </div>
          <div className="item-controls">
            <button onClick={() => handleUpdateQuantity(item.idproduct._id, item.quantity, -1)} disabled={item.quantity <= 1}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => handleUpdateQuantity(item.idproduct._id, item.quantity, 1)}>+</button>
          </div>
          <div className="item-subtotal">
            Tổng: {(item.idproduct.price * item.quantity).toLocaleString('vi-VN')} đ
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <h2>Tổng tiền: {totalAmount.toLocaleString('vi-VN')} đ</h2>
        <button className="btn-use" onClick={() => alert("Chuyển đến trang thanh toán...")}>Thanh toán</button>
      </div>
    </div>
  );
}

export default CartPage;
