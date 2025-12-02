import './Header.css'
import { Link } from "react-router-dom";
import { FaShopify, FaSearch } from 'react-icons/fa';
import { VscAccount } from "react-icons/vsc";
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
function Header() {
  const { userid, role, logout } = useAuth();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    // gửi input qua URL param
    navigate(`/search?query=${encodeURIComponent(searchText)}`);
  }

  return (
    <header className="header">
      <div className="Logo-Container" >
        <Link to="/" >
          <FaShopify className="logo" />
          <span className="descrepsion">TOY</span>
        </Link>
      </div>
      <div className="Search-Container">
        <form className="form-search" onSubmit={handleSearch}>
          <input
            className="input-search"
            type="text"
            placeholder='Tìm kiếm sản phẩm'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <button type="submit" className="btn-search">
            <FaSearch className="icon-search" />
          </button>
        </form>
      </div>
      <div className="Page-CH">
        {role === "admin" && (
          <Link to="/quan-ly">Trang của cửa hàng</Link>
        )}

      </div>
      <div className="user-info">
        <Link to="/userinfo"><VscAccount/></Link>

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