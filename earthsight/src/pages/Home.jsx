import React from "react";

import About from "../components/About";
import ImageSlider from "../components/ImageSlider";
import Features from "../components/Features";
import Story from "../components/Story";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hero from "../components/HEro";

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <ImageSlider />
      <Features />
      <Story />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
