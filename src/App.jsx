import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/common/layout";
import About from "./pages/about";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      </Layout>
      </>
  );
}

export default App;