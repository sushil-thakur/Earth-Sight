import React, { useState, useEffect } from 'react'
import DomeGallery from './DomeGallery'

const DomsGallary = () => {
  const [galleryImages, setGalleryImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Unsplash API configuration
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'GsUednnwMHO6FL8Fm4ldeWgedM9wip9-8xs0TYFLzM0'

  // Search queries for different categories
  const searchQueries = [
    { query: 'deforestation amazon rainforest', alt: 'Amazon Rainforest Deforestation' },
    { query: 'marine life coral reef ocean', alt: 'Marine Life Ecosystem' },
    { query: 'forest fire wildfire', alt: 'Forest Fire Monitoring' },
    { query: 'mining operations aerial', alt: 'Mining Operations' },
    { query: 'luxury villa real estate', alt: 'Luxury Villa Property' },
    { query: 'modern architecture house', alt: 'Modern Architecture' },
    { query: 'environmental conservation', alt: 'Environmental Conservation' },
    { query: 'sustainable building green', alt: 'Sustainable Building' },
    { query: 'ocean pollution cleanup', alt: 'Ocean Conservation' },
    { query: 'urban development city', alt: 'Urban Development' },
    { query: 'wildlife habitat forest', alt: 'Wildlife Habitat' },
    { query: 'residential property modern', alt: 'Modern Residential Property' },
  ]

  useEffect(() => {
  const localFallbacks = [
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

    const fetchUnsplashImages = async () => {
      try {
        setIsLoading(true)

        // Fetch multiple results per query and pick one unique image for each query
        const perPage = 5
        const usedIds = new Set()
        const images = []
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5)

        for (let i = 0; i < searchQueries.length; i++) {
          const { query, alt } = searchQueries[i]
          try {
            const response = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
              {
                headers: {
                  Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
              }
            )
            const data = await response.json()
            const results = Array.isArray(data?.results) ? shuffle(data.results) : []

            // Find the first result not already used
            const pick = results.find(p => !usedIds.has(p.id))
            if (pick) {
              usedIds.add(pick.id)
              images.push({
                src: pick.urls.regular,
                alt,
                photographer: pick.user?.name,
                photographerUrl: pick.user?.links?.html,
              })
              continue
            }

            // If none available or all used, try to pick any unused result
            const anyUnused = results.find(p => !usedIds.has(p.id))
            if (anyUnused) {
              usedIds.add(anyUnused.id)
              images.push({
                src: anyUnused.urls.regular,
                alt,
                photographer: anyUnused.user?.name,
                photographerUrl: anyUnused.user?.links?.html,
              })
              continue
            }

            // Fallback to local if Unsplash didn't return a unique image
            images.push(localFallbacks[i % localFallbacks.length])
          } catch (err) {
            console.warn(`Unsplash query failed for \"${query}\":`, err)
            images.push(localFallbacks[i % localFallbacks.length])
          }
        }

        setGalleryImages(images)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching Unsplash images:', error)
        setGalleryImages(localFallbacks.slice(0, searchQueries.length))
        setIsLoading(false)
      }
    }

    fetchUnsplashImages()
  }, [])

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
        {isLoading && (
          <p className="text-emerald-400 text-xs mt-2 animate-pulse">
            Loading stunning images from Unsplash...
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-400 mb-4"></div>
            <p className="text-white text-lg">Loading Gallery...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Dome Gallery */}
          {galleryImages.length > 0 && (
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
          )}

          {/* Unsplash Attribution */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <p className="text-xs text-slate-400 text-center">
              Photos by talented photographers on{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                Unsplash
              </a>
            </p>
          </div>
        </>
      )}
    </section>
  )
}

export default DomsGallary