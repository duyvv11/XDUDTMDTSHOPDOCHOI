import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import './CartPage.css';

const USER_ID = localStorage.getItem("userid");

function CartPage() {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCartData = async () => {
    if (!USER_ID) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${USER_ID}`);
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      setCart(null);
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
      const res = await fetch(`http://localhost:5000/api/cart/updatequantity`, {
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

  const handlePlaceOrder = async () => {
    if (!cart?.itemcart?.length || !USER_ID) {
      alert("Giỏ hàng trống hoặc thông tin người dùng không hợp lệ.");
      return;
    }

    const totalAmount = cart.itemcart.reduce((total, item) => total + item.idproduct.price * item.quantity, 0);

    const order = {
      amount: totalAmount,
      bankCode: '',
      language: 'vn',
      userid: USER_ID
    }; 

    try {
      const res = await fetch(`http://localhost:5000/api/order/create_payment_url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Chuyến đến trang thanh toán");
        // Trả về kết quả 
        const result = await res.json();
        // chuyển hướng đến VNPAY 
        window.location.href = result.paymentUrl;

        // Xóa giỏ hàng trên Server sau khi tạo Order thành công
        await fetch(`http://localhost:5000/api/cart/${USER_ID}`, {
          method: 'DELETE',
        });

        // Tải lại giỏ hàng 
        fetchCartData();
      } else {
        alert(`Lỗi đặt hàng: ${data.message || 'Vui lòng kiểm tra lại giỏ hàng.'}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      alert("Lỗi kết nối server khi đặt hàng.");
    }
  };


  if (isLoading) return <div className="cart-container">Đang tải giỏ hàng...</div>;
  if (!USER_ID) return <div className="cart-container"><h1>Giỏ hàng</h1><p>Vui lòng đăng nhập để xem giỏ hàng.</p></div>;
  if (!cart?.itemcart?.length) return <div className="cart-container"><h1>Giỏ hàng</h1><p>Giỏ hàng trống.</p></div>;

  const totalAmount = cart.itemcart.reduce((total, item) => total + item.idproduct.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Giỏ hàng</h2>
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
        <button className="btn-use" onClick={handlePlaceOrder}>
          Đặt Hàng Và Thanh Toán 
        </button>
      </div>
    </div>
  );
}

export default CartPage;