import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import PublicLayout from "./components/PublicLayout";
import AdminLayout from './components/admin/AdminLayout';

// Trang Public
import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";  
import CartPage from "./pages/Cart";

// Trang Admin
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import BrandManagement from './components/admin/BrandManagement'; // Bạn đã import đúng ở đây

function App() {
  return (
    <Router>
      <Routes>
        
        {/* === Route cho Trang Bán Hàng === */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/Category" element={<Category />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/Product/:id" element={<ProductDetail />} />
          <Route path="/login" element ={<Login/>}/>
          <Route path="/Cart" element ={<CartPage/>}/>
        </Route>

        {/* === Route cho Trang Quản Lý === */}
        <Route path="/quan-ly" element={<AdminLayout />}>
          <Route index element={<ProductManagement />} /> 
          <Route path="san-pham" element={<ProductManagement />} />
          <Route path="don-hang" element={<OrderManagement />} />
          
          {/* --- BẠN BỊ THIẾU DÒNG NÀY --- */}
          <Route path="thuong-hieu" element={<BrandManagement />} /> 
          {/* ----------------------------- */}

        </Route>

      </Routes>
    </Router>
  );
}

export default App;