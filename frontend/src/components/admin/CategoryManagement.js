import React, { useState, useEffect } from 'react';

const DEFAULT_CATEGORY_DATA = {
  name: '',
  description: '',
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newCategoryData, setNewCategoryData] = useState(DEFAULT_CATEGORY_DATA);
  
  const [editingCategory, setEditingCategory] = useState(null); 

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/category'); 
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
    setIsLoading(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryData.name) return;

    try {
      const response = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategoryData)
      });
      if (response.ok) {
        setNewCategoryData(DEFAULT_CATEGORY_DATA); 
        fetchCategories(); 
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    
    try {
      const response = await fetch(`/api/category/${categoryId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchCategories(); 
      }
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };
  
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    try {
      const response = await fetch(`/api/category/${editingCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingCategory.name,
          description: editingCategory.description
        })
      });
      if (response.ok) {
        setEditingCategory(null); 
        fetchCategories(); 
      }
    } catch (error) {
      console.error("Lỗi khi sửa danh mục:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewCategoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Quản lý Danh mục</h2>
      </div>

      {!editingCategory && (
        <form onSubmit={handleAddCategory} style={{ marginBottom: '20px', background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff' }}>
          <h4>Thêm danh mục mới</h4>
          <div className="admin-form-group">
            <label>Tên danh mục</label>
            <input
              name="name"
              placeholder="Ví dụ: Đồ chơi lắp ráp"
              value={newCategoryData.name}
              onChange={handleNewChange}
              className="admin-input"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Mô tả (Description)</label>
            <textarea
              name="description"
              placeholder="Mô tả ngắn về danh mục..."
              value={newCategoryData.description}
              onChange={handleNewChange}
              className="admin-input"
              rows="3"
            ></textarea>
          </div>
          <button type="submit" className="admin-btn">Thêm mới</button>
        </form>
      )}
      
      {editingCategory && (
        <form onSubmit={handleUpdateCategory} style={{ marginBottom: '20px', background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff' }}>
          <h4>Đang sửa: {editingCategory.name}</h4>
          <div className="admin-form-group">
            <label>Tên danh mục</label>
            <input
              name="name"
              value={editingCategory.name}
              onChange={handleEditChange}
              className="admin-input"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Mô tả (Description)</label>
            <textarea
              name="description"
              value={editingCategory.description || ''}
              onChange={handleEditChange}
              className="admin-input"
              rows="3"
            ></textarea>
          </div>
          <button type="submit" className="admin-btn" style={{ marginRight: '10px' }}>Lưu thay đổi</button>
          <button type="button" onClick={() => setEditingCategory(null)} className="admin-btn" style={{ background: '#555' }}>Hủy</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th style={{width: '200px'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="3">Đang tải...</td></tr>
            ) : (
              categories.map(category => (
                <tr key={category._id}> 
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td className="action-buttons">
                    <button onClick={() => setEditingCategory(category)} className="admin-btn-edit">Sửa</button>
                    <button onClick={() => handleDeleteCategory(category._id)} className="admin-btn-delete">Xóa</button>
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

export default CategoryManagement;