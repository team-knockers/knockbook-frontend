import { Route, Routes, Navigate } from "react-router-dom"

import ResponsiveShell from "./components/layout/ResponsiveShell"
import IntroPage from "./pages/IntroPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import BooksPage from "./pages/BooksPage"
import ProductsPage from "./pages/ProductsPage"
import LoungePage from "./pages/LoungePage"
import FeedPage from "./pages/FeedPage"

import './styles/App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<IntroPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route element={<ResponsiveShell/>}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/lounge" element={<LoungePage />} />
        <Route path="/feed" element={<FeedPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
