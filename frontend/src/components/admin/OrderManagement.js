import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // fetch('http://localhost:5000/api/orders')
    //   .then(res => res.json())
    //   .then(data => setOrders(data));
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h2>Quản lý Đơn hàng</h2>
      </div>
    </div>
  );
};

export default OrderManagement;