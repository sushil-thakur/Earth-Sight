import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Deforestation from './pages/Deforestation'
import RealEstate from './pages/RealEstate'
import ProtectedRoute from './components/ProtectedRoute'


const App = () => {
  return (
   <main className='relative min-h-screen w-screen overflow-x-hidden'>
    <Navbar />
    <Routes>
  <Route path="/" element={<Home/>} />
  <Route path="/deforestation" element={<ProtectedRoute><Deforestation/></ProtectedRoute>} />
  <Route path="/real-estate" element={<ProtectedRoute><RealEstate/></ProtectedRoute>} />
    </Routes>
   </main>
  )
}

export default App
