// file: src/components/admin/AdminLayout.js (CẬP NHẬT VIP)
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

import './Admin.css'; // Import file CSS mới

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminLayout;