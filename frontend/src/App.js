import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

// import pages
import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";  
import CartPage from "./pages/Cart";

function App() {
  return (
    <Router>
      <Header />
      <Menu />
      <Footer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Product/:id" element={<ProductDetail />} />
        <Route path="/login" element ={<Login/>}/>
        <Route path="/Cart" element ={<CartPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
