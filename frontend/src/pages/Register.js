import { useState } from "react";
import './Auth.css'; 
import { useNavigate } from "react-router-dom";
function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    role: "user"
  });
  const navigate = useNavigate();
  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(res.ok){
        alert(data.msg);
        setFormData({ name: "", email: "", password: "", address: "", phone: "" });
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      alert("Lỗi server");
    }
  }

  return (
    <div className="form-wrapper">
      <h2 className="form-title">Đăng Ký</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Tên</label>
        <input
          id="name"
          type="text"
          placeholder="Nhập tên"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Nhập email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          type="password"
          placeholder="Nhập mật khẩu"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="address">Địa chỉ</label>
        <input
          id="address"
          type="text"
          placeholder="Nhập địa chỉ"
          value={formData.address}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="phone">Số điện thoại</label>
        <input
          id="phone"
          type="text"
          placeholder="Nhập số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          className="input-field"
          required
        />

        <button type="submit" className="btn-submit">Đăng Ký</button>
      </form>
    </div>
  )
}

export default Register;
