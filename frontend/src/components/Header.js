import './Header.css'
import { FaShopify, FaSearch } from 'react-icons/fa';
function Header() {
  return (
    <header className="header">
      <div className="Logo-Container" >
        <a >
          <FaShopify className="logo" />
          <span className="descrepsion">TOY</span>
        </a>
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
      <div>Đăng Nhập</div>
    </header>
  )
}
export default Header;