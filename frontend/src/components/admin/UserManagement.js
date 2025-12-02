import { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy danh sách user
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/user'); // backend trả về tất cả user
      const data = await res.json();
      if (data) setUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải người dùng", error);
    }
    setIsLoading(false);
  };

  // Xóa user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  // (Tuỳ chọn) cập nhật role
  const handleUpdateRole = async (userId, role) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error("Lỗi khi cập nhật role:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h2>Quản lý Người Dùng</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>SĐT</th>
              <th>Role</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6">Đang tải...</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.phone}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="admin-btn-delete"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default UserManagement;
