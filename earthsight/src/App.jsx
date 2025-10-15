import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Deforestation from "./pages/Deforestation";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/AboutUs";
import Contact from "./pages/ContactUs";
import EarthSightDashboard from "./pages/RealEstate";

const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <Navbar />
      <div className="h-16" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/deforestation"
          element={
            <ProtectedRoute>
              <Deforestation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/real-estate"
          element={
            <ProtectedRoute>
              <EarthSightDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </main>
  );
};

export default App;
