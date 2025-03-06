import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from "react-router";
import Header from './components/common/header.jsx';
import Footer from './components/common/footer.jsx';
import About from './pages/about.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header/>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} /> 
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
    <Footer />
  </StrictMode>,
)
