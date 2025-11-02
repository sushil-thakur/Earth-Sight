import React from 'react'

import About from '../components/About'
import DomsGallary from '../components/DomsGallary'
import Features from '../components/Features'
import Story from '../components/Story'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
// import Laser from '@/components/laser'

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <DomsGallary />
      <Features />
      <Story />
      <Contact />
      <Footer />
      {/* <Laser/> */}
    </>
  )
}

export default Home
