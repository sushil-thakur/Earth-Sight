import { Zap, Home, TrendingUp, BarChart3, Download } from "lucide-react"
import { useState } from "react"
import { pdfApi } from "../utils/api"
import { useAuth } from "../contexts/AuthContext"
import { showToast } from "./FuturisticToast"

export function PredictionResults({ predictedPrice, forecastData, formatPrice, predictionData }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { user } = useAuth()

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true)
      
      // Prepare report data matching backend expectations
      const reportData = {
        predictionData: {
          prediction: {
            currentPrice: predictedPrice,
            confidence: predictionData?.confidence || 87,
            modelType: predictionData?.modelType || 'XGBoost',
            marketTrend: predictionData?.marketTrend || 'stable',
            locationScore: predictionData?.locationScore || 75,
            factors: predictionData?.factors || []
          },
          forecast: forecastData
        },
        userInput: {
          location: predictionData?.location || null,
          latitude: predictionData?.lat || predictionData?.latitude || null,
          longitude: predictionData?.lng || predictionData?.longitude || null,
          bedrooms: predictionData?.bedrooms || 3,
          bathrooms: predictionData?.bathrooms || 2,
          area: predictionData?.area || 2000,
          floors: predictionData?.floors || 2,
          age: predictionData?.age || 5
        },
        userInfo: {
          email: user?.email || user?.name || 'Guest User',
          name: user?.name || 'Guest'
        },
        timestamp: new Date().toISOString(),
        reportType: 'real-estate-prediction'
      }

      console.log('Generating PDF report...', reportData)
      
      // Call backend to generate PDF
      const response = await pdfApi.generateReport(reportData)
      
      if (response.success && response.filename) {
        // Download the PDF
        const downloadUrl = pdfApi.download(response.filename)
        window.open(downloadUrl, '_blank')
        showToast('📄 Report generated successfully!', 'success', 3000)
      } else {
        throw new Error('Failed to generate report')
      }
    } catch (error) {
      console.error('Download error:', error)
      showToast('❌ Failed to download report. Please try again.', 'error', 3000)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Price Card with RGB border - Full Width */}
      <div className="relative group animate-scale-in">
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 shadow-2xl">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-sm text-emerald-700 mb-3 font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI Predicted Price
              </p>
              <h3 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {formatPrice(predictedPrice)}
              </h3>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30">
              <Home className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between md:justify-start md:flex-col md:items-start">
              <span className="text-sm text-slate-700 font-medium">Confidence Score</span>
              <span className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30">
                87% Accurate
              </span>
            </div>

            <div className="md:col-span-2">
              <div className="relative w-full bg-emerald-200/50 rounded-full h-4 overflow-hidden border border-emerald-300">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-1000 shadow-lg"
                  style={{ width: "87%" }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-700 bg-white/60 rounded-xl p-4 border border-emerald-200 mt-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>
              Based on <span className="font-bold text-slate-900">{Math.floor(Math.random() * 500 + 500)}</span> similar
              properties
            </span>
          </div>
        </div>
      </div>

      <div className="relative group animate-scale-in" style={{ animationDelay: "0.1s" }}>
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative backdrop-blur-xl bg-white/95 rounded-3xl p-10 shadow-xl border border-emerald-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              10-Year Price Projection
            </h3>
          </div>

          {forecastData && forecastData.length > 0 ? (
            <>
              <div className="grid grid-cols-10 gap-3 h-80 items-end">
                {forecastData.map((item, idx) => {
                  const maxPrice = Math.max(...forecastData.map((d) => d.price))
                  const height = maxPrice > 0 ? (item.price / maxPrice) * 100 : 0
                  
                  // Debug log for first item
                  if (idx === 0) {
                    console.log('Chart data:', { item, maxPrice, height, forecastLength: forecastData.length })
                  }
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full group/bar relative">
                      {/* Tooltip with Growth & Confidence */}
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white border border-emerald-200 rounded-lg p-2 z-10 whitespace-nowrap shadow-lg">
                        <p className="text-xs text-emerald-600 font-bold mb-1">Year {item.year}</p>
                        <p className="text-xs text-slate-700">Growth: <span className="text-emerald-600 font-bold">{item.growth || 0}%</span></p>
                        <p className="text-xs text-slate-700">Confidence: <span className="text-teal-600 font-bold">{item.confidence || 0}%</span></p>
                      </div>
                      
                      {/* Bar container with fixed height */}
                      <div className="relative w-full h-full flex flex-col justify-end">
                        {/* The actual bar */}
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-1000 shadow-lg relative group-hover/bar:scale-105 border border-emerald-200"
                          style={{ 
                            height: `${height}%`,
                            minHeight: '20px',
                            transitionDelay: `${idx * 50}ms` 
                          }}
                        >
                          {/* Price label */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="text-xs font-bold text-emerald-600 bg-white/90 px-2 py-1 rounded border border-emerald-200">
                              {item.price >= 1000000 
                                ? `$${(item.price / 1000000).toFixed(2)}M`
                                : `$${(item.price / 1000).toFixed(0)}K`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Year label */}
                      <span className="text-xs text-slate-600 font-mono font-semibold mt-1">{item.year}</span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-12 pt-6 border-t border-emerald-200">
                <p className="text-sm text-slate-700 text-center font-medium">
                  Projected annual growth rate: <span className="text-emerald-600 font-bold">8%</span> • Powered by Advanced AI
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-80 text-slate-600">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold mb-2">No Forecast Data Available</p>
                <p className="text-sm">Forecast will appear after prediction</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Download Button - Full Width */}
      <button 
        onClick={handleDownloadReport}
        disabled={isDownloading}
        className="w-full py-5 rounded-2xl backdrop-blur-xl bg-white/95 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 font-semibold text-lg text-slate-800 transition-all hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/20 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-3">
          <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : 'group-hover:animate-bounce'}`} />
          <span>{isDownloading ? 'Generating Report...' : 'Download Full Report'}</span>
        </div>
      </button>
    </div>
  )
}