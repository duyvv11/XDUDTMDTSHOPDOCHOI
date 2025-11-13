import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import './Login.css';
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const HandleLogin = async (e) => {

      console.log(email);
      e.preventDefault();
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userid", data.user.id);
        alert("Đăng nhập thành công");
        navigate("/");

      } else {
        alert(data.msg);
      }
    }

  return (
    <div className="Login-Section" >
      <h2>Đăng Nhập</h2>
      <form className="Form-DangNhap" onSubmit={HandleLogin} >
        <label target="input-email">Email</label>
        <input id="input-email" type="email" placeholder="Nhập email" required value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <label target="input-password">Mật khẩu</label>
        <input id="input-password" type="password" placeholder="Nhập mật khẩu" value={password} required onChange={(e) => setPassword(e.target.value)}></input>
        <button className="btn-use" type="submit" >Đăng nhập</button>
        <p>Chưa có tài khoản đăng ký? <Link to="/register">Đăng ký</Link></p>
      </form>
    </div>
  )
}
export default Login;