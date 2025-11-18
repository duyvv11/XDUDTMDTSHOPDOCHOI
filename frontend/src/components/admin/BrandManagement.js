// file: frontend/src/components/admin/BrandManagement.js (ĐÃ SỬA)
import React, { useState, useEffect } from 'react';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBrandName, setNewBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);

  // SỬA Ở ĐÂY
  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/brand'); // Bỏ /v1
      const data = await response.json();
      if (Array.isArray(data)) {
        setBrands(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải thương hiệu:", error);
    }
    setIsLoading(false);
  };

  // SỬA Ở ĐÂY
  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName) return;

    try {
      const response = await fetch('/api/brand', { // Bỏ /v1
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName })
      });
      if (response.ok) {
        setNewBrandName('');
        fetchBrands();
      }
    } catch (error) {
      console.error("Lỗi khi thêm thương hiệu:", error);
    }
  };

  // SỬA Ở ĐÂY
  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
    
    try {
      const response = await fetch(`/api/brand/${brandId}`, { // Bỏ /v1
        method: 'DELETE'
      });
      if (response.ok) {
        fetchBrands();
      }
    } catch (error) {
      console.error("Lỗi khi xóa thương hiệu:", error);
    }
  };
  
  // SỬA Ở ĐÂY
  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    if (!editingBrand) return;
    
    try {
      const response = await fetch(`/api/brand/${editingBrand._id}`, { // Bỏ /v1
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingBrand.name })
      });
      if (response.ok) {
        setEditingBrand(null);
        fetchBrands();
      }
    } catch (error) {
      console.error("Lỗi khi sửa thương hiệu:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h2>Quản lý Thương hiệu</h2>
      </div>

      <form onSubmit={handleAddBrand} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Tên thương hiệu mới..."
          value={newBrandName}
          onChange={(e) => setNewBrandName(e.target.value)}
          className="admin-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="admin-btn">Thêm mới</button>
      </form>
      
      {editingBrand && (
        <form onSubmit={handleUpdateBrand} style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff' }}>
          <h4>Đang sửa: {editingBrand.name}</h4>
          <input
            type="text"
            value={editingBrand.name}
            onChange={(e) => setEditingBrand({...editingBrand, name: e.target.value})}
            className="admin-input"
          />
          <button type="submit" className="admin-btn" style={{ marginRight: '10px', marginTop: '10px' }}>Lưu thay đổi</button>
          <button type="button" onClick={() => setEditingBrand(null)} className="admin-btn" style={{ background: '#555' }}>Hủy</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên thương hiệu</th>
              <th style={{width: '200px'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="2">Đang tải...</td></tr>
            ) : (
              brands.map(brand => (
                <tr key={brand._id}> 
                  <td>{brand.name}</td>
                  <td className="action-buttons">
                    <button onClick={() => setEditingBrand(brand)} className="admin-btn-edit">Sửa</button>
                    <button onClick={() => handleDeleteBrand(brand._id)} className="admin-btn-delete">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandManagement;