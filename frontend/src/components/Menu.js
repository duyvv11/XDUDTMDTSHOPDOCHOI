import { NavLink } from 'react-router-dom';
import './Menu.css';
function Menu() {
  return (
    <div className="menu">
      <ul>
        <li><NavLink to="/">Trang Chủ</NavLink></li>
        <li><NavLink to="Product">Sản Phẩm</NavLink></li>
        <li><NavLink to="#">Thương Hiệu</NavLink></li>
        <li><NavLink to="/Category">Danh Mục</NavLink></li>
        <li><NavLink to="/Cart">Giỏ Hàng</NavLink></li>
      </ul>
    </div>
  )
}
export default Menu;