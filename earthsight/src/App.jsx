import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Deforestation from "./pages/Deforestation";
import RealEstate from "./pages/RealEstate";
import { ToastContainer } from "./components/FuturisticToast";
import About from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

const App = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden border">
      <Navbar />
      <div className="h-18" />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deforestation" element={<Deforestation />} />
        <Route path="/real-estate" element={<RealEstate />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </main>
  );
};

