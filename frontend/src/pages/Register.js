function Login() {
  return (
    <div className="Register-Section">
      <h1>Đăng Ký</h1>
      <form className="Form-DangKy">
        <label target="input-name">Tên</label>
        <input id="input-name" type="text" placeholder="Nhập tên" required></input>
        <label target="input-email">Email</label>
        <input id="input-email" type="email" placeholder="Nhập email" required></input>
        <label target="input-password">Mật khẩu</label>
        <input id="input-password" type="password" placeholder="Nhập mật khẩu" required></input>
        <label target="input-adress">Địa chỉ</label>
        <input id="input-adress" type="text" placeholder="Nhập địa chỉ" required></input>
        <label target="input-phone">Số điện thoại </label>
        <input id="input-phone" type="text" placeholder="Nhập số điện thoại" required></input>
        <button type="submit">Đăng Ký</button>
      </form>
    </div>
  )
}