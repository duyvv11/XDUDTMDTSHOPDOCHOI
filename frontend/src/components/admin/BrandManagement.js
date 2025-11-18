import React, { useState, useEffect } from 'react';

const DEFAULT_BRAND_DATA = {
  name: '',
  description: '',
  foundedYear: '' 
};

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newBrandData, setNewBrandData] = useState(DEFAULT_BRAND_DATA);
  
  const [editingBrand, setEditingBrand] = useState(null); 

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/brand'); 
      const data = await response.json();
      if (Array.isArray(data)) {
        setBrands(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải thương hiệu:", error);
    }
    setIsLoading(false);
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrandData.name) return;

    try {
      const response = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBrandData,
          foundedYear: Number(newBrandData.foundedYear) 
        })
      });
      if (response.ok) {
        setNewBrandData(DEFAULT_BRAND_DATA); 
        fetchBrands(); 
      }
    } catch (error) {
      console.error("Lỗi khi thêm thương hiệu:", error);
    }
  };

  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
    
    try {
      const response = await fetch(`/api/brand/${brandId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchBrands(); 
      }
    } catch (error) {
      console.error("Lỗi khi xóa thương hiệu:", error);
    }
  };
  
  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    if (!editingBrand) return;
    
    try {
      const response = await fetch(`/api/brand/${editingBrand._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingBrand.name,
          description: editingBrand.description,
          foundedYear: Number(editingBrand.foundedYear) 
        })
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

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewBrandData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingBrand(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Quản lý Thương hiệu</h2>
      </div>

      {!editingBrand && (
        <form onSubmit={handleAddBrand} style={{ marginBottom: '20px', background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff' }}>
          <h4>Thêm thương hiệu mới</h4>
          <div className="admin-form-group">
            <label>Tên thương hiệu</label>
            <input
              name="name"
              placeholder="Ví dụ: Hasbro"
              value={newBrandData.name}
              onChange={handleNewChange}
              className="admin-input"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Mô tả (Description)</label>
            <textarea
              name="description"
              placeholder="Mô tả ngắn về thương hiệu..."
              value={newBrandData.description}
              onChange={handleNewChange}
              className="admin-input"
              rows="3"
            ></textarea>
          </div>
          <div className="admin-form-group">
            <label>Năm thành lập</label>
            <input
              name="foundedYear" 
              type="number"
              placeholder="Ví dụ: 1990"
              value={newBrandData.foundedYear}
              onChange={handleNewChange}
              className="admin-input"
            />
          </div>
          <button type="submit" className="admin-btn">Thêm mới</button>
        </form>
      )}
      
      {editingBrand && (
        <form onSubmit={handleUpdateBrand} style={{ marginBottom: '20px', background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff' }}>
          <h4>Đang sửa: {editingBrand.name}</h4>
          <div className="admin-form-group">
            <label>Tên thương hiệu</label>
            <input
              name="name"
              value={editingBrand.name}
              onChange={handleEditChange}
              className="admin-input"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Mô tả (Description)</label>
            <textarea
              name="description"
              value={editingBrand.description || ''}
              onChange={handleEditChange}
              className="admin-input"
              rows="3"
            ></textarea>
          </div>
          <div className="admin-form-group">
            <label>Năm thành lập</label>
            <input
              name="foundedYear" 
              type="number"
              value={editingBrand.foundedYear || ''}
              onChange={handleEditChange}
              className="admin-input"
            />
          </div>
          <button type="submit" className="admin-btn" style={{ marginRight: '10px' }}>Lưu thay đổi</button>
          <button type="button" onClick={() => setEditingBrand(null)} className="admin-btn" style={{ background: '#555' }}>Hủy</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên thương hiệu</th>
              <th>Mô tả</th>
              <th>Năm T.Lập</th>
              <th style={{width: '200px'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4">Đang tải...</td></tr>
            ) : (
              brands.map(brand => (
                <tr key={brand._id}> 
                  <td>{brand.name}</td>
                  <td>{brand.description}</td>
                  <td>{brand.foundedYear}</td>
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