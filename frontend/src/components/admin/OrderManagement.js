import { useState, useEffect } from 'react';

const formatVN = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh"
  });
};

console.log(formatVN("2025-11-18T15:43:11.848Z"));


const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {  // tải dữ liệu
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/order'); 
      const data = await response.json();
      if (data) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng", error);
    }
    setIsLoading(false);
  };

// sự kiện xóa *
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/order/${orderId}`, {  // api
        method: 'DELETE'
      });
      if (response.ok) {
        fetchOrders(); 
      }
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
    }
  };
  
  const handleUpdateOrder = async (orderId,status) => {
    if (!window.confirm("Nhận đơn hàng này")) return;
    alert(status);
    
    try {
      const response = await fetch(`http://localhost:5000/api/order/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status
        })
      });
      if (response.ok) {
        fetchOrders(); 
        alert("Nhận đơn thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const handleEditChange = (e,order) => {
    const status = e.target.value;
    handleUpdateOrder(order._id,status);

  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Quản lý Đơn Hàng</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Khách Hàng</th>
              <th>Sản Phẩm</th>
              <th>Thành Tiền </th>
              <th>Phương Thức Thanh Toán</th>
              <th>Trạng thái</th>
              <th>Date</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4">Đang tải...</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}> 
                  <td>{order.iduser.name}<br></br>SĐT:{order.iduser.phone}<br></br>ĐC:{order.iduser.address}</td>  
                  <td>
                    {order.items.map(pd =>{
                      return <p>{pd.name} SL:{pd.quantity}</p>
                    })}
                  </td>
                  <td>{order.total}</td>
                  <td>{order.paymentmethod}</td>
                  <td>{order.status}</td>
                  <td>
                    <p>Ngày Đặt: {formatVN(order.createdAt)}</p>
                    <p>
                      {order.status === "confirmed" || order.status === "shipping"  ? (
                        <p>Ngày nhận đơn: {formatVN(order.updatedAt)}</p>
                      ):(<p> </p>)}
                      {order.status === "completed" ? (
                        <p>Ngày giao đơn: { formatVN(order.updatedAt)}</p>
                      ) : (<p> </p>)}

                    </p>
                  </td>
                  <td className="action-buttons">
                    {order.status === "pending" &&(
                      <button onClick={(e) => handleEditChange(e,order)} value="confirmed" className="admin-btn-edit">Nhận Đơn</button>

                    )}
                    {order.status ==="confirmed" && (
                      <button onClick={(e) => handleEditChange(e, order)} value="shipping" className="admin-btn-edit">Giao Hàng</button>
                    )}
                    {order.status ==="shipping" && (
                      <button onClick={(e) => handleEditChange(e, order)} value="completed" className="admin-btn-edit">Giao xong</button>
                    )}
                    {order.status !=="completed" &&(
                      <button onClick={() => handleDeleteOrder(order._id)} className="admin-btn-delete">Hủy</button>
                    )}
                    
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;