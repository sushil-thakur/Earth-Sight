import { useState, useEffect } from "react"
import { predictionApi, environmentApi } from "../utils/api"
import { Brain, Sparkles } from "lucide-react"
import { PropertyForm } from "../components/property-form"
import { InteractiveMap } from "../components/interactive-map"
import { MarketSummary } from "../components/market-summary"
import { AIAssistant } from "../components/ai-assistant"
import { PriceGuessingGame } from "../components/price-guessing-game"
import { FeaturedProperties } from "../components/feature-propertie"
import { PredictionResults } from "../components/predictions-results"
import { KeyFactors } from "../components/key-factors"
import { LoadingAnimation } from "../components/loading-animation"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardFooter } from "../components/dashboard-footer"

const locationData = {
  Kathmandu: {
    trend: "Rising",
    priceChange: "+12.5%",
    investmentScore: 92,
    propertiesAnalyzed: 1247,
    averagePrice: "NPR 85,00,000",
    amenities: ["Shopping Malls", "Schools", "Hospitals", "Parks"],
    recentListings: [
      { type: "3BHK Apartment", price: "NPR 1.2 Cr", area: "1800 sq ft" },
      { type: "Villa", price: "NPR 3.5 Cr", area: "4500 sq ft" },
      { type: "2BHK Flat", price: "NPR 85 L", area: "1200 sq ft" },
    ],
  },
  Lalitpur: {
    trend: "Stable",
    priceChange: "+8.3%",
    investmentScore: 88,
    propertiesAnalyzed: 892,
    averagePrice: "NPR 78,00,000",
    amenities: ["Cafes", "Universities", "Hospitals", "Gardens"],
    recentListings: [
      { type: "Penthouse", price: "NPR 2.8 Cr", area: "3200 sq ft" },
      { type: "Studio", price: "NPR 45 L", area: "650 sq ft" },
      { type: "4BHK House", price: "NPR 1.9 Cr", area: "2800 sq ft" },
    ],
  },
  Pokhara: {
    trend: "Growing",
    priceChange: "+15.2%",
    investmentScore: 85,
    propertiesAnalyzed: 654,
    averagePrice: "NPR 62,00,000",
    amenities: ["Lake View", "Resorts", "Adventure Sports", "Nature"],
    recentListings: [
      { type: "Lake House", price: "NPR 2.1 Cr", area: "3500 sq ft" },
      { type: "Cottage", price: "NPR 95 L", area: "1500 sq ft" },
      { type: "Resort Villa", price: "NPR 3.2 Cr", area: "5000 sq ft" },
    ],
  },
}

const gameProperties = [
  {
    title: "Modern 3BHK Apartment",
    location: "Kathmandu",
    beds: 3,
    baths: 2,
    area: 1800,
    actualPrice: 12000000,
    image: "/modern-apartment-building.png",
  },
  {
    title: "Luxury Villa",
    location: "Lalitpur",
    beds: 5,
    baths: 4,
    area: 4500,
    actualPrice: 35000000,
    image: "/luxury-villa-exterior.png",
  },
  {
    title: "Lake View House",
    location: "Pokhara",
    beds: 4,
    baths: 3,
    area: 3200,
    actualPrice: 28000000,
    image: "/lake-view-house.jpg",
  },
  {
    title: "Heritage Property",
    location: "Bhaktapur",
    beds: 4,
    baths: 3,
    area: 2800,
    actualPrice: 15000000,
    image: "/traditional-nepali-house.jpg",
  },
  {
    title: "Penthouse Suite",
    location: "Kathmandu",
    beds: 4,
    baths: 4,
    area: 3800,
    actualPrice: 42000000,
    image: "/luxury-penthouse-interior.png",
  },
  {
    title: "Garden Villa",
    location: "Chitwan",
    beds: 3,
    baths: 3,
    area: 3000,
    actualPrice: 21000000,
    image: "/villa-with-garden.jpg",
  },
]

export default function EarthSightDashboard() {
  const [formData, setFormData] = useState({
    location: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    age: "",
  })

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI real estate assistant. Upload a PDF document to analyze property data, or ask me anything about real estate predictions.",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [predictedPrice, setPredictedPrice] = useState(0)
  const [forecastData, setForecastData] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [availableLocations, setAvailableLocations] = useState([])

  // Game state
  const [gameScore, setGameScore] = useState(0)
  const [gameRound, setGameRound] = useState(0)
  const [currentProperty, setCurrentProperty] = useState(null)
  const [userGuess, setUserGuess] = useState("")
  const [gameResult, setGameResult] = useState(null)
  const [showGameResult, setShowGameResult] = useState(false)

  const startNewRound = () => {
    const randomProperty = gameProperties[Math.floor(Math.random() * gameProperties.length)]
    setCurrentProperty(randomProperty)
    setUserGuess("")
    setGameResult(null)
    setShowGameResult(false)
  }

  const submitGuess = () => {
    if (!userGuess || !currentProperty) return

    const guess = Number.parseFloat(userGuess) * 10000000
    const actual = currentProperty.actualPrice
    const difference = Math.abs(guess - actual)
    const percentageOff = (difference / actual) * 100

    let points = 0
    let message = ""

    if (percentageOff < 5) {
      points = 100
      message = "Perfect! Almost exact!"
    } else if (percentageOff < 10) {
      points = 80
      message = "Excellent guess!"
    } else if (percentageOff < 20) {
      points = 60
      message = "Good estimate!"
    } else if (percentageOff < 30) {
      points = 40
      message = "Not bad!"
    } else {
      points = 20
      message = "Keep trying!"
    }

    setGameScore(gameScore + points)
    setGameRound(gameRound + 1)
    setGameResult({ points, message, percentageOff: percentageOff.toFixed(1) })
    setShowGameResult(true)
  }

  useEffect(() => {
    if (!currentProperty) {
      startNewRound()
    }
  }, [])

  useEffect(() => {
    let mounted = true
    environmentApi
      .getLocations()
      .then((resp) => {
        if (mounted && resp && resp.locations) {
          setAvailableLocations(resp.locations)
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch locations from backend, falling back to defaults", err)
      })
    return () => {
      mounted = false
    }
  }, [])

  const currentLocationData = formData.location ? locationData[formData.location] : null

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMapLocationSelect = (locationName) => {
    setFormData((prev) => ({ ...prev, location: locationName }))
  }

  const calculatePrediction = () => {
    if (!formData.location || !formData.area) {
      alert("Please fill in at least location and area")
      return
    }

    setIsLoading(true)
    setShowResults(false)

    const payload = {
      floors: Number(formData.floors) || 1,
      area: Number(formData.area) || 1000,
      bedrooms: Number(formData.bedrooms) || 2,
      bathrooms: Number(formData.bathrooms) || 1,
      age: Number(formData.age) || 0,
      location: formData.location,
    }

    predictionApi
      .predict(payload)
      .then((resp) => {
        try {
          if (resp && resp.prediction && resp.prediction.currentPrice) {
            setPredictedPrice(resp.prediction.currentPrice)
          }
          if (resp && resp.forecast && Array.isArray(resp.forecast)) {
            setForecastData(resp.forecast.map((f) => ({ year: f.year, price: f.price })))
          } else {
            const currentYear = new Date().getFullYear()
            const chartData = Array.from({ length: 10 }, (_, i) => {
              const year = currentYear + i
              const growthRate = 1.08
              const price = predictedPrice * Math.pow(growthRate, i)
              return { year, price: Math.round(price) }
            })
            setForecastData(chartData)
          }
          setShowResults(true)
        } catch (e) {
          setPredictedPrice(0)
          setShowResults(true)
        }
      })
      .catch((err) => {
        console.error("Prediction API error", err)
        setPredictedPrice(0)
        setShowResults(true)
      })
      .finally(() => setIsLoading(false))
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    setTimeout(() => {
      const responses = [
        "Based on current market trends, I can provide detailed insights about property valuations in your specified area.",
        "The data suggests a positive market trend with an average annual appreciation of 7-9% in this region.",
        "I've analyzed the property details. The location score indicates high demand, making this a solid investment opportunity.",
        "Considering the factors, the predicted price aligns well with comparable properties in the vicinity.",
      ]

      const assistantMessage = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsProcessing(false)
    }, 1500)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've received your PDF document "${file.name}". I can now answer questions about its contents. What would you like to know?`,
        },
      ])
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <LoadingAnimation isLoading={isLoading} />

      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Column - Property Form & Map */}
          <div className="space-y-8">
            <PropertyForm formData={formData} availableLocations={availableLocations} onFormChange={handleFormChange} />

            <InteractiveMap selectedLocation={formData.location} onLocationSelect={handleMapLocationSelect} />

            <MarketSummary location={formData.location} locationData={currentLocationData} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AIAssistant
              messages={messages}
              input={input}
              isProcessing={isProcessing}
              onInputChange={setInput}
              onSend={handleSend}
              onFileUpload={handleFileUpload}
            />

            <PriceGuessingGame
              gameScore={gameScore}
              gameRound={gameRound}
              currentProperty={currentProperty}
              userGuess={userGuess}
              gameResult={gameResult}
              showGameResult={showGameResult}
              onGuessChange={setUserGuess}
              onSubmitGuess={submitGuess}
              onStartNewRound={startNewRound}
            />

            <FeaturedProperties />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={calculatePrediction}
            disabled={isLoading}
            className="relative w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 hover:from-indigo-600 hover:via-cyan-600 hover:to-violet-600 font-bold text-lg shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="flex items-center justify-center gap-3 relative z-10">
              <Brain className="w-6 h-6" />
              <span>Generate AI Prediction</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </button>
        </div>

        {showResults && (
          <PredictionResults predictedPrice={predictedPrice} forecastData={forecastData} formatPrice={formatPrice} />
        )}

        <KeyFactors />
      </main>

      <DashboardFooter />

      {/* Inline Styles for Animations */}
      <style>{`
        @keyframes rgb-border {
          0% { border-color: rgb(99, 102, 241); box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
          25% { border-color: rgb(6, 182, 212); box-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
          50% { border-color: rgb(139, 92, 246); box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
          75% { border-color: rgb(236, 72, 153); box-shadow: 0 0 20px rgba(236, 72, 153, 0.5); }
          100% { border-color: rgb(99, 102, 241); box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
        }
        
        .animate-rgb-border {
          border: 2px solid;
          animation: rgb-border 3s linear infinite;
        }
        
        .animate-rgb-border-slow {
          border: 2px solid;
          animation: rgb-border 5s linear infinite;
        }

        @keyframes rgb-line {
          0% { background: linear-gradient(90deg, transparent, rgb(99, 102, 241), transparent); }
          25% { background: linear-gradient(90deg, transparent, rgb(6, 182, 212), transparent); }
          50% { background: linear-gradient(90deg, transparent, rgb(139, 92, 246), transparent); }
          75% { background: linear-gradient(90deg, transparent, rgb(236, 72, 153), transparent); }
          100% { background: linear-gradient(90deg, transparent, rgb(99, 102, 241), transparent); }
        }
        
        .animate-rgb-line {
          animation: rgb-line 3s linear infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-float-slow {
          animation: float 10s ease-in-out infinite;
          animation-delay: 4s;
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes auto-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        .animate-auto-scroll {
          animation: auto-scroll 30s linear infinite;
        }
        
        .animate-auto-scroll:hover {
          animation-play-state: paused;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-slate-700::-webkit-scrollbar-thumb {
          background-color: rgb(51, 65, 85);
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </div>
  )
}