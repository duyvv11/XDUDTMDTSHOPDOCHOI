import { useState, useEffect } from 'react';

const NewManagement = () => {
  const [news, setNews] = useState([]);  // dể tải dữ liệu
  const [isLoading, setIsLoading] = useState(true);  // trạng thái đang load dữ liệu

  // KHỞI TẠO VỚI CÁC KEY SỬ DỤNG TRONG FORM (name, content, imagenew)
  const [newData, setNewData] = useState({ name: '', content: '', imagenew: '' }); // dữ liệu mới gửi lên api

  const [editingNew, setEditingNew] = useState(null);  // dữ liệu sửa gửi lên api

  // fetch data
  const fetchNews = async () => {  // load news hiện dữ liệu
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/new');
      const data = await response.json();
      if (data) {
        // LƯU Ý: Nếu API trả về item với key là 'title' và 'content'
        // thì khi setEditingNew(item) ở dưới, state sẽ có item.title và item.content
        // chúng ta cần đảm bảo logic sửa chữa xử lý đúng key đó.
        setNews(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
    setIsLoading(false);
  };

  // add new
  const handleAddNew = async (e) => {   // bắt sk thêm 
    e.preventDefault();
    if (!newData.name) return; // OK: kiểm tra 'name' (tiêu đề)

    try {
      const response = await fetch('http://localhost:5000/api/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🚀 SỬA LỖI: GỬI DỮ LIỆU ĐÚNG KEY MÀ BACKEND MONG MUỐN
        body: JSON.stringify({
          title: newData.name, // Giả định API Backend muốn 'title'
          content: newData.content, // Giả định API Backend muốn 'content'
          imagenew: newData.imagenew
        })
      });
      if (response.ok) {
        // 🚀 SỬA LỖI: Trả state lưu new category về rỗng (đúng key)
        setNewData({ name: '', content: '', imagenew: '' });
        fetchNews();
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
    }
  };

  // xoa bai viet (Không sửa đổi)
  const handleDeleteNew = async (newId) => {  // bắt sk xóa
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/new/${newId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  // cap nhat bai viet
  const handleUpdateNew = async (e) => { // bắt sk update
    e.preventDefault();
    if (!editingNew) return;

    try {
      const response = await fetch(`http://localhost:5000/api/new/${editingNew._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // 🚀 SỬA LỖI: GỬI DỮ LIỆU ĐÚNG KEY MÀ BACKEND MONG MUỐN
        body: JSON.stringify({
          // Giả định API Backend muốn 'title' và 'content'
          title: editingNew.title,
          content: editingNew.content,
          imagenew: editingNew.imagenew // Cần gửi thêm cả hình ảnh nếu có
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

  useEffect(() => {
    fetchNews();
  }, []);

  const handleNewChange = (e) => {   // nhận dữ liệu từ ô nhập vào newCate
    const { name, value } = e.target;
    // 🚀 SỬA LỖI: SỬ DỤNG KEY ĐÚNG NAME TRONG FORM (name, content, imagenew)
    setNewData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    // 🚀 SỬA LỖI: SỬ DỤNG KEY ĐÚNG NAME TRONG FORM (title, content, imagenew)
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
              name="name" // Dùng name="name" cho tiêu đề
              placeholder="Tiêu đề bài viết"
              // 🚀 SỬA LỖI: Dùng newData.name
              value={newData.name || ''}
              onChange={handleNewChange}
              className="admin-input"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Chi tiết</label>
            <textarea
              name="content" // Dùng name="content" cho chi tiết
              placeholder="Mô tả"
              // 🚀 SỬA LỖI: Dùng newData.content
              value={newData.content || ''}
              onChange={handleNewChange}
              className="admin-input"
              rows="3"
            ></textarea>
          </div>
          <div className="admin-form-group">
            <label>Hình ảnh (Image)</label>
            <textarea
              name="imagenew" // Dùng name="imagenew" cho hình ảnh
              placeholder="Hình ảnh url"
              value={newData.imagenew || ""}
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
          <h4>Đang sửa: {editingNew.title}</h4>
          <div className="admin-form-group">
            <label>Title</label>
            <input
              name="title" // Dùng name="title" để khớp với key trả về từ API
              // 🚀 SỬA LỖI: Dùng editingNew.title
              value={editingNew.title || ''}
              onChange={handleEditChange}
              className="admin-input"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Chi tiết</label>
            <textarea
              name="content" // Dùng name="content" để khớp với key trả về từ API
              // 🚀 SỬA LỖI: Dùng editingNew.content
              value={editingNew.content || ''}
              onChange={handleEditChange}
              className="admin-input"
              rows="3"
            ></textarea>
          </div>
          <div className="admin-form-group">
            <label>Hình ảnh (Image)</label>
            <textarea
              name="imagenew" // Dùng name="imagenew" để khớp với key trả về từ API
              value={editingNew.imagenew || ''}
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
              <th style={{ width: '200px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4">Đang tải...</td></tr>
            ) : (
              news.map(item => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.content}</td>
                  <td>
                    {/* 🚀 Bổ sung kiểm tra điều kiện để tránh lỗi nếu imagenew không tồn tại */}
                    {item.imagenew && <img src={item.imagenew} className="imgnewinadmin" alt={item.title}></img>}
                  </td>
                  <td className="action-buttons">
                    {/* 🚀 Cần truyền đúng item để setEditingNew */}
                    <button onClick={() => setEditingNew(item)} className="admin-btn-edit">Sửa</button>
                    <button onClick={() => handleDeleteNew(item._id)} className="admin-btn-delete">Xóa</button>
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

export default NewManagement;