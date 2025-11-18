import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import CategoryManagement from './components/admin/CategoryManagement';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import CheckoutPage from "./pages/CheckoutPage";

function App() {

  return (
    <Router>
      <Header />
      <Menu />
      <Footer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Cart" element={<CartPage />} />
        <Route path="/checkout/:orderId" element={<CheckoutPage/>}/>
        
        <Route path="/quan-ly" element={<AdminLayout />}>
        <Route path="san-pham" element={<ProductManagement />} />
        <Route path="don-hang" element={<OrderManagement />} />
        <Route path="thuong-hieu" element={<BrandManagement />} />
        </Route>
      </Routes>


    </Router>
    
  );
}

export default App;