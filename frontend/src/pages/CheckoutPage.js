// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './CheckoutPage.css'; 

// // const USER_ID = localStorage.getItem("userid");

// function CheckoutPage() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [paymentMethod, setPaymentMethod] = useState('');

//   // Fetch chi tiết đơn hàng
//   const fetchOrderDetails = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`http://localhost:5000/api/order/${orderId}`);
//       const data = await res.json();

//       if (res.ok) {
//         setOrder(data);
//         setPaymentMethod(data.paymentmethod);
//       } else {
//         alert(`Lỗi tải đơn hàng: ${data.message}`);
//         navigate('/cart');
//       }
//     } catch (error) {
//       console.error("Lỗi khi tải chi tiết đơn hàng:", error);
//       alert("Không thể kết nối Server để tải đơn hàng.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (orderId) {
//       fetchOrderDetails();
//     } else {
//       navigate('/');
//     }
//   }, [orderId]);

//   // Xử lý xác nhận thanh toán/đặt hàng
//   const handleConfirmOrder = async () => {
//     if (!paymentMethod) {
//       alert("Vui lòng chọn phương thức thanh toán.");
//       return;
//     }

//     try {
//       let res;
//       if(paymentMethod==="Paid-Money"){
//         // cap nhat thanh toan
//         res = await fetch(`http://localhost:5000/api/order/confirm/${orderId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             paymentmethod: paymentMethod,
//             status: 'confirmed',
//           }),
//         });
//       }
//       if(paymentMethod==="Paid-Bank"){
//         res = await fetch(`http://localhost:5000/api/order/thanhtoanvnpay`,
//           {
//             method:'POST',
//             header:{'Content-Type':'application/json'},
//             body:JSON.stringify({
//               amount: order.total,
//               orderDescription: `Thanh toan Don hang # ${orderId}`,
//               orderType: 'billpayment', 
//               bankCode: '', 
//               language: 'vn'
//             })
//           }
//         ) 
//       }
//         const data = await res.json();

//         if (res.ok) {
//           alert(`Đặt hàng thành công! Phương thức: ${paymentMethod}. Đơn hàng đang được xử lý.`);
//           navigate('/orders');
//         } else {
//           alert(`Xác nhận đơn hàng thất bại: ${data.message}`);
//         }
  

      
      
//     } catch (error) {
//       console.error("Lỗi khi xác nhận đơn hàng:", error);
//       alert("Lỗi kết nối server khi xác nhận đơn hàng.");
//     }
//   };

//   if (isLoading) return <div className="checkout-container">Đang tải chi tiết đơn hàng...</div>;
//   if (!order) return <div className="checkout-container">Không tìm thấy đơn hàng.</div>;

//   return (
//     <div className="checkout-container">
//       <h2>Xác Nhận Thanh Toán Đơn Hàng #{orderId.substring(orderId.length - 6)}</h2>

//       <div className="checkout-summary-box">
//         <h3>Chi tiết đơn hàng</h3>
//         {order.items.map((item, index) => (
//           <div key={index} className="item-line">
//             <span>{item.idproduct.name}</span>
//           </div>
//         ))}
//         <div className="total-line">
//           <strong>Tổng tiền:</strong>
//           <strong>{order.total.toLocaleString('vi-VN')} đ</strong>
//         </div>
//       </div>

//       <div className="payment-options">
//         <h3>Chọn Phương Thức Thanh Toán</h3>

//         <label className="payment-option">
//           <input
//             type="radio"
//             value="Paid-Money"
//             checked={paymentMethod === 'Paid-Money'}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//           />
//           Thanh toán khi nhận hàng (COD)
//         </label>

//         <label className="payment-option">
//           <input
//             type="radio"
//             value="Paid-Bank"
//             checked={paymentMethod === 'Paid-Bank'}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//           />
//           Thanh Toán VN PAY
//         </label>
//       </div>

//       <button
//         className="btn-use confirm-btn"
//         onClick={handleConfirmOrder}
//       >
//         Xác Nhận Đơn Hàng và Thanh Toán
//       </button>
//     </div>
//   );
// }

// export default CheckoutPage;