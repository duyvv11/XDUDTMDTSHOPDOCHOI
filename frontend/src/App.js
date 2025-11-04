import { BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";


function App() {
  return (
    <Router>
      <Header />
      <Menu />
      <Footer />
    </Router>
  );
}

export default App;
