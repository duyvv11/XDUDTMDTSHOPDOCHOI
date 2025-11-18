// file: frontend/src/components/admin/AdminSidebar.js (ĐÃ SỬA LỖI LẶP)
import React from 'react';
import { NavLink } from 'react-router-dom'; // Dùng NavLink thay vì Link

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h3>Bảng quản lý</h3>
      </div>
      <nav className="admin-sidebar-nav">
        <ul>
          <li>
            <NavLink to="/quan-ly/san-pham">Quản lý Sản phẩm</NavLink>
          </li>
          <li>
            <NavLink to="/quan-ly/don-hang">Quản lý Đơn hàng</NavLink>
          </li>
          <li>
            <NavLink to="/quan-ly/nguoi-dung">Quản lý Người dùng</NavLink>
          </li>
          <li>
            <NavLink to="/quan-ly/thuong-hieu">Quản lý Thương hiệu</NavLink>
          </li>
          <li>
            <NavLink to="/quan-ly/bai-viet">Quản lý Bài viết</NavLink>
          </li>
        </ul>
      </nav>
      <div className="admin-sidebar-footer">
        © 2023 T-OY Admin
      </div>
    </div>
  );
};

export default AdminSidebar;