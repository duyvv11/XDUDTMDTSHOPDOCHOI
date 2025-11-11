import { Link } from "react-router-dom" ;
import './Login.css';
function Login(){
  return (
    <div className="Login-Section">
      <h1>Đăng Nhập</h1>
      <form className="Form-DangNhap">
        <label target="input-email">Email</label>
        <input id="input-email" type="email" placeholder="Nhập email" required></input>
        <label target="input-password">Mật khẩu</label>
        <input id="input-password" type="password" placeholder="Nhập mật khẩu" required></input>
        <button type="submit">Đăng nhập</button>
        <p>Chưa có tài khoản đăng ký? <Link to="/register">Đăng ký</Link></p>
      </form>
    </div>
  )
}
export default Login;