import './VnPayReturnPage.css';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const VnPayReturnPage = () => {
  const location = useLocation();
  const [resultMessage, setResultMessage] = useState('Đang kiểm tra kết quả...');
  const [statusClass, setStatusClass] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get('vnp_ResponseCode');
  const txnRef = queryParams.get('vnp_TxnRef');
  const amount = queryParams.get('vnp_Amount');

  useEffect(() => {
    if (responseCode === '00') {
      setResultMessage(`Thanh toán thành công! Mã đơn hàng: ${txnRef}. Số tiền: ${amount / 100} VNĐ.`);
      setStatusClass('vnpay-success');
    } else if (responseCode === '24') {
      setResultMessage('Giao dịch bị hủy. Vui lòng thử lại.');
      setStatusClass('vnpay-fail');
    } else {
      setResultMessage(`Thanh toán thất bại. Mã lỗi: ${responseCode}`);
      setStatusClass('vnpay-fail');
    }
  }, [responseCode, txnRef, amount]);

  return (
    <div className="vnpay-container">
      <h2>Kết Quả Thanh Toán VNPAY</h2>
      <p className={`vnpay-message ${statusClass}`}>{resultMessage}</p>
      <Link to="/Order">Xem Đơn Hàng</Link>
    </div>
  );
};

export default VnPayReturnPage;
