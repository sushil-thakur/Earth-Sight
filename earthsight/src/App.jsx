import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Deforestation from './pages/Deforestation'
import RealEstate from './pages/RealEstate'
import Contact from './pages/Contact'
import About from './pages/About'
import { ToastContainer } from './components/FuturisticToast'


const App = () => {
  return (
   <main className='relative min-h-screen w-screen overflow-x-hidden'>
    <Navbar />
    <ToastContainer />
    <Routes>
  <Route path="/" element={<Home/>} />
  <Route path="/deforestation" element={<Deforestation/>} />
  <Route path="/real-estate" element={<RealEstate/>} />
  <Route path="/contact" element={<Contact/>} />
  <Route path="/about" element={<About/>} />
    </Routes>
   </main>
  )
}

export default App
