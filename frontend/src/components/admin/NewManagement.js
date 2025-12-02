import { useState, useEffect } from 'react';
const NewManagement = () => {
  const [news, setNews] = useState([]);  // dể tải dữ liệu
  const [isLoading, setIsLoading]= useState(true);  // trạng thái đang load dữ liệu
  
  const [newData, setNewData] = useState({}); // dữ liệu mới gửi lên api
  
  const [editingNew, setEditingNew] = useState(null);  // dữ liệu sửa gửi lên api

  const fetchNews = async () => {  // load news hiện dữ liệu
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/new'); 
      const data = await response.json();
      if (data) {
        setNews(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
    setIsLoading(false);
  };

  const handleAddNew = async (e) => {   // bắt sk thêm 
    e.preventDefault();
    if (!newData.name) return;

    try {
      const response = await fetch('http://localhost:5000/api/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (response.ok) {
        setNewData({});  // trả state lưu new category về rỗng
        fetchNews(); 
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
    }
  };

  const handleDeleteNew = async (newId) => {  // bắt sk xóa
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    
    try {
      const response = await fetch(`/api/category/${newId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchNews(); 
      }
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };
  
  const handleUpdateNew = async (e) => { // bắt sk update
    e.preventDefault();
    if (!editingNew) return;
    
    try {
      const response = await fetch(`/api/new/${editingNew._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingNew.title,
          description: editingNew.content
        })
      });
      if (response.ok) {
        setEditingNew(null); 
        fetchNews(); 
      }
    } catch (error) {
      console.error("Lỗi khi sửa danh mục:", error);
    }
  };

  useEffect(() => {  // load lại khi thay đổi
    fetchNews();
  }, []);

  const handleNewChange = (e) => {   // nhận dữ liệu từ ô nhập vào newCate
    const { name, value } = e.target;
    setNewData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingNew(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Quản lý Bài Viết</h2>
      </div>

      {!editingNew && (
        <form onSubmit={handleAddNew} style={{ marginBottom: '20px', background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff' }}>
          <h4>Thêm bài viết mới</h4>
          <div className="admin-form-group">
            <label>Tiêu đề</label>
            <input
              name="name"
              placeholder="Tiêu đề bài viết"
              value={newData.title}
              onChange={handleNewChange}
              className="admin-input"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Chi tiết</label>
            <textarea
              name="description"
              placeholder="Mô tả"
              value={newData.content}
              onChange={handleNewChange}
              className="admin-input"
              rows="3"
            ></textarea>
          </div>
          <div className="admin-form-group">
            <label>Hình ảnh (Image)</label>
            <textarea
              name="imgcategories"
              placeholder="Hình ảnh url"
              value={newData.imagenew ||""}
              onChange={handleNewChange}
              className="admin-input"
              rows="3"
            ></textarea>
          </div>
          <button type="submit" className="admin-btn">Thêm mới</button>
        </form>
      )}
      
      {editingNew && (
        <form onSubmit={handleUpdateNew} style={{ marginBottom: '20px', background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff' }}>
          <h4>Đang sửa: {editingNew.name}</h4>
          <div className="admin-form-group">
            <label>Title</label>
            <input
              name="name"
              value={editingNew.title}
              onChange={handleEditChange}
              className="admin-input"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Chi tiết</label>
            <textarea
              name="description"
              value={editingNew.content || ''}
              onChange={handleEditChange}
              className="admin-input"
              rows="3"
            ></textarea>
          </div>
          <button type="submit" className="admin-btn" style={{ marginRight: '10px' }}>Lưu thay đổi</button>
          <button type="button" onClick={() => setEditingNew(null)} className="admin-btn" style={{ background: '#555' }}>Hủy</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Chi tiết</th>
              <th>Hình ảnh</th>
              <th style={{width: '200px'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="3">Đang tải...</td></tr>
            ) : (
              news.map(item =>(
                <tr key={item._id}> 
                  <td>{item.title}</td>
                  <td>{item.content}</td>
                  <td><img src={item.imagenew} className="imgnewinadmin"></img></td>
                  <td className="action-buttons">
                    <button onClick={() => setEditingNew(item)} className="admin-btn-edit">Sửa</button>
                    <button onClick={() => handleDeleteNew(item._id)} className="admin-btn-delete">Xóa</button>
                  </td>
                </tr>
              )))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewManagement;