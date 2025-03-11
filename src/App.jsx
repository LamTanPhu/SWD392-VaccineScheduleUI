import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/common/layout";
import About from "./pages/about";
import Home from "./pages/home";
//import LoginPage from "./pages/login";
//import Signup from "./pages/signup";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
//import Schedule from "./pages/schedule";

function App() {
  return (
    <>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            {/* <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* <Route path="/schedule" element={<Schedule />} /> */}
          </Routes>
        </BrowserRouter>
      </Layout>
    </>
  );
}

export default App;
