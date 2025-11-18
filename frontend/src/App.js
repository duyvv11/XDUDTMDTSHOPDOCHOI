import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";
import AdminLayout from './components/admin/AdminLayout';

import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";  
import CartPage from "./pages/Cart";

import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import BrandManagement from './components/admin/BrandManagement';
import CategoryManagement from './components/admin/CategoryManagement'; // <-- THÊM DÒNG NÀY

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/Category" element={<Category />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/Product/:id" element={<ProductDetail />} />
          <Route path="/login" element ={<Login/>}/>
          <Route path="/Cart" element ={<CartPage/>}/>
        </Route>

        <Route path="/quan-ly" element={<AdminLayout />}>
          <Route index element={<ProductManagement />} /> 
          <Route path="san-pham" element={<ProductManagement />} />
          <Route path="don-hang" element={<OrderManagement />} />
          <Route path="thuong-hieu" element={<BrandManagement />} /> 
          <Route path="danh-muc" element={<CategoryManagement />} /> {/* <-- THÊM DÒNG NÀY */}
section
        </Route>

      </Routes>
    </Router>
  );
}

export default App;