import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import './Auth.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user.id, data.user.role);
        alert("Đăng nhập thành công");
        navigate("/");
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.log(error);
      alert("Lỗi server");
    }
  }

  return (
    <div className="form-wrapper">
      <h2 className="form-title">Đăng Nhập</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-field"
          required
        />

        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input-field"
          required
        />

        <button type="submit" className="btn-submit">Đăng Nhập</button>
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </form>
    </div>
  )
}

export default Login;
