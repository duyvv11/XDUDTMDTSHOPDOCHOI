import { useState, useEffect } from 'react';
import './UserInfoPage.css';
function UserInfoPage() {
  const userid = localStorage.getItem("userid");
  const [user, setUser] = useState({});

  // State riêng cho 2 trường có thể sửa
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // trạng thái edit
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/${userid}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setAddress(data.address || "");
        setPhone(data.phone || "");
      })
      .catch(error => console.log(error))
  }, [userid]);

  // Bật chế độ edit
  const handleEdit = () => {
    setIsEditing(true);
  }

  // Hủy edit
  const handleCancel = () => {
    setIsEditing(false);
    setAddress(user.address || "");
    setPhone(user.phone || "");
  }

  // Lưu dữ liệu
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, phone })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Cập nhật thành công!");
        setUser(prev => ({ ...prev, address, phone }));
        setIsEditing(false);
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.log(error);
      alert("Lỗi server!");
    }
  }

  return (
    <div className="user-info-container">
      <label>Tên:</label>
      <p>{user.name || ""}</p>

      <label>Email:</label>
      <p>{user.email || ""}</p>

      <label>Địa chỉ:</label>
      {isEditing ? (
        <input
          placeholder="Địa chỉ"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      ) : (
        <p>{user.address || ""}</p>
      )}

      <label>SĐT:</label>
      {isEditing ? (
        <input
          placeholder="Số điện thoại"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      ) : (
        <p>{user.phone || ""}</p>
      )}

      {/* Nút Sửa / Lưu & Hủy */}
      {isEditing ? (
        <>
          <button onClick={handleSave}>Lưu</button>
          <button onClick={handleCancel} style={{ marginLeft: "10px" }}>Hủy</button>
        </>
      ) : (
        <button onClick={handleEdit}>Sửa</button>
      )}
    </div>
  )
}

export default UserInfoPage;
