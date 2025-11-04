import Product from "./Product";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function Home() {
  return (
    <Router>
      <h3>Tất cả sản phẩm</h3>
      <Product/>
      <Routes>
        <Route></Route>
      </Routes>
    </Router>
  )


}
export default Home;