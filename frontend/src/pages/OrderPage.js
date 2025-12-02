import { useState, useEffect } from "react";
import './OrderPage.css';
const userid = localStorage.getItem("userid");

function OrderPage (){
  const [orders,setOrders]=useState([]);
  const fetchDataOrder = async ()=>{
    const res = await fetch(`http://localhost:5000/api/order/byuser/${userid}`)
    const data = await res.json();
    console.log(data);
    setOrders(data);
  }
  useEffect(()=>{
    fetchDataOrder();
  },[])
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'shipping':
        return 'status-shipping';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/order/${orderId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: "cancelled" }) 
      });

      if (res.ok) {
        alert("Đơn hàng đã được hủy thành công!");
        fetchDataOrder();
      } else {
        const errorData = await res.json();
        alert(`Hủy đơn hàng thất bại: ${errorData.message || 'Lỗi server.'}`);
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert("Lỗi kết nối server khi hủy đơn hàng.");
    }
  };
  return (
    <div className="order-page-container">
      <h2>Đơn Hàng của tôi</h2>
      {orders.map(od => {
        return (
          <div key={od._id} className="card-order">

            <p className="order-id-display">
              <span>Mã đơn hàng:</span>
              <span>{od._id.slice(-6)}</span>
            </p>

            <p>Ngày đặt: {new Date(od.createdAt).toLocaleDateString('vi-VN')}</p>

            <div className="product-list">
              {od.items.map((it, index) => {
                return (
                  <p key={index}>
                    <span>{it.name}</span>
                    <span>SL: {it.quantity}</span>
                  </p>
                )
              })}
            </div>

            <p>Phương thức thanh toán: {od.paymentmethod}</p>

            <p className="total-amount">Thành tiền: {od.total.toLocaleString('vi-VN')} VNĐ</p>

            <p>
              Trạng thái đơn hàng:
              <span className={`status-label ${getStatusClass(od.status)}`}>
                {od.status}
              </span>
            </p>
            {od.status === "pending" && (
              <button className="btn-use" onClick={() => handleCancelOrder(od._id)}>Hủy</button>
            )}
          </div>
        )
      })}
    </div>

  )
}
export default OrderPage;