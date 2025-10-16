import React from 'react'
import DomeGallery from './DomeGallery'

const DomsGallary = () => {
  // Environmental and real estate themed images
  const galleryImages = [
    { src: '/img/deforestation1.jpg', alt: 'Amazon Rainforest Deforestation' },
    { src: '/img/marine.jpg', alt: 'Marine Life Ecosystem' },
    { src: '/img/forest-fire.jpg', alt: 'Forest Fire Monitoring' },
    { src: '/img/mining.jpg', alt: 'Mining Operations' },
    { src: '/img/villa.jpg', alt: 'Luxury Villa Property' },
    { src: '/img/modern.jpg', alt: 'Modern Architecture' },
    { src: '/img/pokhara.webp', alt: 'Pokhara Real Estate' },
    { src: '/img/herutage.jpeg', alt: 'Heritage Property' },
    { src: '/img/homesuit.webp', alt: 'Home Suite' },
    { src: '/img/chitwan.jpg', alt: 'Chitwan Property' },
    { src: '/img/citycenter.jpeg', alt: 'City Center Development' },
    { src: '/img/hill.webp', alt: 'Hill Station Property' },
  ]

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* Title Overlay */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">
          Our <span className="text-emerald-400">Gallery</span>
        </h2>
        <p className="text-slate-300 text-sm md:text-base">
          Drag to explore environmental monitoring & real estate insights
        </p>
      </div>

      {/* Dome Gallery */}
      <DomeGallery
        images={galleryImages}
        fit={0.6}
        minRadius={600}
        maxRadius={1200}
        overlayBlurColor="#000000"
        maxVerticalRotationDeg={8}
        dragSensitivity={25}
        enlargeTransitionMs={400}
        segments={35}
        imageBorderRadius="20px"
        openedImageBorderRadius="30px"
        openedImageWidth="500px"
        openedImageHeight="500px"
        grayscale={false}
      />
    </section>
  )
}

export default DomsGallary