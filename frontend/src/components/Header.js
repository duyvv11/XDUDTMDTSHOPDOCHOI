import './Header.css'
import { Link } from "react-router-dom";
import { FaShopify, FaSearch } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
function Header() {
  const { userid, role, logout } = useAuth();

  return (
    <header className="header">
      <div className="Logo-Container" >
        <Link to="/" >
          <FaShopify className="logo" />
          <span className="descrepsion">TOY</span>
        </Link>
      </div>
      <div className="Search-Container">
        <form className="form-search">
          <input className="input-search"
            type="text"
            placeholder='tim kiem san pham'
          />
          <button type="submit" className="btn-search" >
            <FaSearch className="icon-search" />
          </button>
        </form>
      </div>
      <div className="Page-CH">
        {role === "admin" && (
          <Link to="/quan-ly">Trang của cửa hàng</Link>
        )}

      </div>
      <div className="Link-LogInOut">
        {userid ? (
          <Link onClick={logout}>Đăng Xuất </Link>

        ) : (
          <Link to="/login">Đăng Nhập </Link>
        )
        }
      </div>
    </header>
  )
}
export default Header;