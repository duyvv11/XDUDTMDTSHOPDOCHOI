import { useEffect, useState } from "react";
import './CartPage.css';

const USER_ID = localStorage.getItem("userid");

function CartPage() {
  const [cart, setCart] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const totalAmount = cart?.itemcart?.reduce((total, item) => total + item.idproduct.price * item.quantity, 0) || 0;
  // load du lieu gio hang
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

  // cap nhat so luong
  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

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

  
  // khi chọn đặt hàng bằng tiền mặt
  const handlePlaceOrderPaidMonney = async () => {
    if (!cart?.itemcart?.length || !USER_ID) {
      alert("Giỏ hàng trống hoặc thông tin người dùng không hợp lệ");
      return;
    }

    
    const order = {
      iduser: USER_ID,
      total: totalAmount,
      items: cart.itemcart.map(it =>{
        return {
          name:it.idproduct.name,
          quantity:it.quantity
        }
      })
    }; 

    try {
      const res = await fetch(`http://localhost:5000/api/order/create-paymonney`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        alert("thanh toán thành công");
        await fetch(`http://localhost:5000/api/cart/${USER_ID}`, {
          method: 'DELETE',
        });
        fetchCartData();
      } else {
        alert("Lỗi đặt hàng");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      alert("Lỗi kết nối server khi đặt hàng.");
    }
  };

  const handlePlaceOrderPaidVnPay = async () => {
    if (!cart?.itemcart?.length || !USER_ID) {
      alert("Giỏ hàng trống hoặc thông tin người dùng không hợp lệ");
      return;
    }

    const order = {
      total: totalAmount,
      bankCode: '',
      language:'vn',
      iduser: USER_ID,
      items: cart.itemcart.map(it => {
        return {
          name: it.idproduct.name,
          quantity: it.quantity
        }
      })
    };

    try {
      const res = await fetch(`http://localhost:5000/api/order/create_payment_url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        alert("Chuyến đến trang thanh toán");
        const result = await res.json();
        window.location.href = result.paymentUrl;

        // 
        await fetch(`http://localhost:5000/api/cart/${USER_ID}`, {
          method: 'DELETE',
        });
        fetchCartData();
      } else {
        alert("Lỗi đặt hàng");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      alert("Lỗi kết nối server khi đặt hàng.");
    }
  };
  // xóa sp trong gio
  const handleRemoveItem = async (productId) => {
    if (!USER_ID || !productId) return;

    setCart(prevCart => ({
      ...prevCart,
      itemcart: prevCart.itemcart.filter(item => item.idproduct._id !== productId),
    }));

    try {
      const res = await fetch(`http://localhost:5000/api/cart/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: USER_ID, productid: productId }),
      });

      if (!res.ok) {
        throw new Error("Xóa sản phẩm thất bại");
      }

    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Lỗi khi xóa sản phẩm. Đang tải lại giỏ hàng...");
      fetchCartData(); // Tải lại dữ liệu nếu có lỗi
    }
  };


  if (isLoading) return <div className="cart-container">Đang tải giỏ hàng...</div>;
  if (!USER_ID) return <div className="cart-container"><h1>Giỏ hàng</h1><p>Vui lòng đăng nhập để xem giỏ hàng.</p></div>;
  if (!cart?.itemcart?.length) return <div className="cart-container"><h1>Giỏ hàng</h1><p>Giỏ hàng trống.</p></div>;

  return (
    <div className="cart-container">
      <h2>Giỏ hàng</h2>
      {cart.itemcart.map(item => (
        <div key={item.idproduct._id} className="cart-item">
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
          <button
            className="btn-remove"
            onClick={() => handleRemoveItem(item.idproduct._id)}
            style={{ marginLeft: '20px', backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
          >
            Xóa
          </button>
        </div>
      ))}
      <div className="cart-summary">
        <h2>Tổng tiền: {totalAmount.toLocaleString('vi-VN')} đ</h2>
        <button className="btn-use" onClick={handlePlaceOrderPaidMonney} style={{marginRight:"20px"}}>
          Đặt Hàng Thanh Toán Tiền Mặt
        </button>
        <button className="btn-use" onClick={handlePlaceOrderPaidVnPay}>
          Đặt hàng Thanh Toán VnPay
        </button>
      </div>
    </div>
  );
}

export default CartPage;