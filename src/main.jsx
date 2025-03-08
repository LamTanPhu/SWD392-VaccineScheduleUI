// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter, Route, Routes } from "react-router";
// import Header from './components/layout/header.jsx';
// import Footer from './components/common/footer.jsx';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Header/>
//     <BrowserRouter>
//       <Routes>
//         <Route index element={<App />} />
//       </Routes>
//     </BrowserRouter>
//     <Footer />
//   </StrictMode>,
// )
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
