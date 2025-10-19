import { useState, useEffect } from "react"
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Star,
  Building2,
  ShoppingBag,
  GraduationCap,
  Hospital,
  TreePine,
  Home,
  MapPin,
  Loader2,
  Search,
  Download,
  FileJson,
  AlertCircle,
  FileText,
  Info,
  HelpCircle,
  X,
} from "lucide-react"
import { getComprehensiveMarketAnalysis } from "../services/attomDataService"
import { showToast } from "./FuturisticToast"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function MarketSummary({ location, locationData }) {
  const [postalCode, setPostalCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attomData, setAttomData] = useState(null)
  const [error, setError] = useState(null)
  const [showDocumentation, setShowDocumentation] = useState(false)

  // Fetch ATTOM data when postal code is provided
  const fetchMarketData = async () => {
    if (!postalCode || postalCode.length < 5) {
      showToast("⚠️ Please enter a valid 5-digit postal code", "warning", 3000)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await getComprehensiveMarketAnalysis({
        postalcode: postalCode
      })

      console.log('ATTOM API Response:', result)
      console.log('Summary data:', result.summary)
      console.log('Properties count:', result.data?.properties?.length)
      console.log('Average price:', result.summary?.averagePrice)
      console.log('Area data:', result.data?.area)
      console.log('Community data:', result.data?.community)
      console.log('POI data:', result.data?.pois)

      if (result.success) {
        setAttomData(result)
        showToast(`✅ Found ${result.summary?.totalProperties || 0} properties!`, "success", 2500)
      } else {
        setError(result.error || "Failed to fetch market data")
        showToast(`❌ ${result.error || "Failed to fetch market data"}`, "error", 3000)
      }
    } catch (err) {
      console.error("Market data fetch error:", err)
      setError(err.message || "An error occurred")
      showToast("❌ Failed to load market data", "error", 3000)
    } finally {
      setIsLoading(false)
    }
  }

  // Download data as JSON
  // Download as JSON
  const downloadData = (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}_${postalCode}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast(`✅ Downloaded ${filename} (JSON)`, "success", 2000)
  }

  // Download as PDF
  const downloadAsPDF = (type = 'complete') => {
    if (!attomData) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let yPos = 20

    // Helper to check if we need a new page
    const checkPageBreak = (neededSpace = 20) => {
      if (yPos + neededSpace > pageHeight - 20) {
        doc.addPage()
        yPos = 20
        return true
      }
      return false
    }

    // Header
    doc.setFillColor(59, 130, 246) // Blue
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont(undefined, 'bold')
    doc.text('EarthSight Market Analysis Report', pageWidth / 2, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    doc.text(`ZIP Code: ${postalCode}`, pageWidth / 2, 30, { align: 'center' })
    
    yPos = 50
    doc.setTextColor(0, 0, 0)

    // Date
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, yPos)
    yPos += 10

    // Summary Section
    if (type === 'complete' || type === 'summary') {
      checkPageBreak(40)
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'bold')
      doc.text('Market Summary', 14, yPos)
      yPos += 10

      const summary = attomData.summary || {}
      const summaryData = [
        ['Total Properties', summary.totalProperties?.toString() || 'N/A'],
        ['Average Price', summary.averagePrice ? `$${summary.averagePrice.toLocaleString()}` : 'N/A'],
        ['Median Price', summary.medianPrice ? `$${summary.medianPrice.toLocaleString()}` : 'N/A'],
        ['Price Range', summary.priceRange || 'N/A'],
        ['Investment Score', summary.investmentScore ? `${summary.investmentScore}/100` : 'N/A'],
        ['Market Trend', summary.marketTrend || 'N/A'],
      ]

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 80, fontStyle: 'bold' },
          1: { cellWidth: 'auto' }
        }
      })
      yPos = doc.lastAutoTable.finalY + 15
    }

    // Properties Section
    if ((type === 'complete' || type === 'properties') && attomData.data?.properties) {
      checkPageBreak(40)
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Properties List', 14, yPos)
      yPos += 10

      const properties = attomData.data.properties.slice(0, 50) // Limit to 50 for PDF
      const propertyRows = properties.map((prop, idx) => [
        (idx + 1).toString(),
        prop.address?.line1 || 'N/A',
        `${prop.address?.locality || ''}, ${prop.address?.countrySubd || ''}`,
        prop.address?.postal1 || postalCode,
        prop.location?.latitude || 'N/A',
        prop.location?.longitude || 'N/A'
      ])

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Address', 'City, State', 'ZIP', 'Latitude', 'Longitude']],
        body: propertyRows,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 50 },
          2: { cellWidth: 45 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 }
        }
      })
      yPos = doc.lastAutoTable.finalY + 15
    }

    // POI Data Section
    if ((type === 'complete' || type === 'poi') && attomData.data?.pois) {
      checkPageBreak(40)
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Points of Interest', 14, yPos)
      yPos += 10

      const pois = attomData.data.pois
      if (pois.success && pois.data && Array.isArray(pois.data)) {
        const poiRows = pois.data.slice(0, 30).map(poi => [
          poi.name || 'N/A',
          poi.type || 'N/A',
          poi.distance || 'N/A'
        ])

        autoTable(doc, {
          startY: yPos,
          head: [['Name', 'Type', 'Distance']],
          body: poiRows,
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
          styles: { fontSize: 9, cellPadding: 4 }
        })
        yPos = doc.lastAutoTable.finalY + 15
      }
    }

    // Footer on last page
    const totalPages = doc.internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${i} of ${totalPages} | EarthSight Market Analysis | ${postalCode}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    // Save PDF
    const filename = `market_analysis_${type}_${postalCode}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)
    showToast(`✅ Downloaded ${type} report (PDF)`, "success", 2000)
  }

  // PDF Download Functions
  const downloadCompletePDF = () => downloadAsPDF('complete')
  const downloadPropertiesPDF = () => downloadAsPDF('properties')
  const downloadPOIPDF = () => downloadAsPDF('poi')

  // Download all data
  const downloadAllData = () => {
    if (!attomData) return
    downloadData(attomData, 'complete_market_analysis')
  }

  // Download specific sections
  const downloadProperties = () => {
    if (!attomData?.data?.properties) return
    downloadData(attomData.data.properties, 'properties_data')
  }

  const downloadPOIData = () => {
    if (!attomData?.data?.pois) return
    downloadData(attomData.data.pois, 'poi_data')
  }

  // Use ATTOM data if available, otherwise fall back to locationData
  const displayData = attomData?.summary || locationData
  const hasAttomData = !!attomData

  // Format price helper
  const formatPrice = (price) => {
    if (!price || price === 0) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Get display values from ATTOM data or fallback
  const getDisplayValues = () => {
    if (hasAttomData && attomData.summary) {
      // Use data from summary which has all calculated values
      const summary = attomData.summary
      const properties = attomData.data?.properties || []
      const pois = attomData.data?.pois || []

      return {
        trend: summary.trend || "Stable",
        investmentScore: summary.investmentScore || 75,
        propertiesAnalyzed: summary.totalProperties || properties.length || 0,
        averagePrice: formatPrice(summary.averagePrice || 0),
        priceChange: summary.priceChange || "+5.2%",
        amenities: summary.amenities || pois.slice(0, 4).map(poi => poi.category || poi.name || poi.type) || [],
        recentListings: summary.recentListings || [],
        locationName: summary.locationInfo?.city 
          ? `${summary.locationInfo.city}, ${summary.locationInfo.state}` 
          : postalCode,
        demographics: attomData.data?.community?.demographics || {}
      }
    }

    // Fallback to locationData
    return {
      trend: locationData?.trend || "Stable",
      investmentScore: locationData?.investmentScore || 75,
      propertiesAnalyzed: locationData?.propertiesAnalyzed || 0,
      averagePrice: locationData?.averagePrice || "N/A",
      priceChange: locationData?.priceChange || "+5.2%",
      amenities: locationData?.amenities || [],
      recentListings: locationData?.recentListings || [],
      locationName: location,
      demographics: {}
    }
  }

  const displayValues = getDisplayValues()

  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {displayValues.locationName} Market
            </h3>
            <button
              onClick={() => setShowDocumentation(true)}
              className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all group"
              title="View Market Summary Documentation"
            >
              <Info className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{displayValues.priceChange}</span>
          </div>
        </div>

        {/* Postal Code Input - Always show for searching new areas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {hasAttomData ? "Search Another Area" : "Enter Postal Code for Real Market Data"}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g., 82009"
              maxLength={5}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              onKeyPress={(e) => e.key === 'Enter' && fetchMarketData()}
            />
            <button
              onClick={fetchMarketData}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400">⚠️ {error}</p>
          )}
          {hasAttomData && (
            <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
              ✓ Real-time data from ATTOM API
            </p>
          )}
        </div>

        {/* Show default message if no ATTOM data */}
        {!hasAttomData && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Enter a postal code to view real market data</p>
            <p className="text-slate-500 text-sm mt-2">Powered by ATTOM Data API</p>
          </div>
        )}

        {/* Show market data if available (ATTOM or fallback) */}
        {(hasAttomData || locationData) && (
          <>
            {/* Market Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: TrendingUp, label: "Trend", value: displayValues.trend, color: "indigo" },
                { icon: Star, label: "Score", value: `${Math.round(displayValues.investmentScore)}/100`, color: "cyan" },
                {
                  icon: BarChart3,
                  label: "Properties",
                  value: displayValues.propertiesAnalyzed.toLocaleString(),
                  color: "violet",
                },
                { icon: DollarSign, label: "Avg Price", value: displayValues.averagePrice, color: "blue" },
              ].map(({ icon: Icon, label, value }, idx) => (
                <div key={idx} className="relative group/card">
                  <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-indigo-500/50 to-cyan-500/50 opacity-0 group-hover/card:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative backdrop-blur-xl bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all">
                    <div className="inline-flex p-2.5 rounded-lg bg-indigo-500/20 mb-3 shadow-lg">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-400 mb-1 font-medium">{label}</p>
                    <p className="text-lg font-bold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Investment Score Meter */}
            <div className="mb-6 p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-300">Investment Score</span>
                <span className="text-2xl font-bold text-cyan-400">{displayValues.investmentScore}/100</span>
              </div>
              <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 transition-all duration-1000 shadow-lg shadow-cyan-500/50"
                  style={{ width: `${displayValues.investmentScore}%` }}
                />
              </div>
            </div>

            {/* Amenities */}
            {displayValues.amenities && displayValues.amenities.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  Key Amenities & POIs
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {displayValues.amenities.map((amenity, idx) => {
                    const icons = [ShoppingBag, GraduationCap, Hospital, TreePine]
                    const Icon = icons[idx % icons.length]
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-indigo-500/30 transition-all"
                      >
                        <Icon className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs text-slate-300 font-medium">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Recent Listings */}
            {displayValues.recentListings && displayValues.recentListings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4 text-cyan-400" />
                  Recent Listings
                </h4>
                <div className="space-y-3">
                  {displayValues.recentListings.map((listing, idx) => (
                    <div
                      key={idx}
                      className="relative group/listing p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-cyan-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">{listing.type}</span>
                        <span className="text-sm font-bold text-cyan-400">{listing.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Home className="w-3 h-3" />
                        <span>{listing.area}</span>
                      </div>
                      {listing.address && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{listing.address}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Download Section */}
            {hasAttomData && attomData && (
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-emerald-400" />
                  Download API Data
                </h4>
                
                {/* Data Summary Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className="text-xs text-slate-400 mb-1">Properties Data</div>
                    <div className="text-sm font-bold text-white">
                      {attomData.data?.properties?.length || 0} properties
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className="text-xs text-slate-400 mb-1">Area Data</div>
                    <div className="text-sm font-bold text-white">
                      {attomData.metadata?.hasAreaData ? 'Available' : 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className="text-xs text-slate-400 mb-1">Community Data</div>
                    <div className="text-sm font-bold text-white">
                      {attomData.metadata?.hasCommunityData ? 'Available' : 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className="text-xs text-slate-400 mb-1">POI Data</div>
                    <div className="text-sm font-bold text-white">
                      {attomData.data?.pois?.length || 0} categories
                    </div>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Export Options
                  </div>
                  
                  {/* Complete Analysis Downloads */}
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 mb-1.5">Complete Analysis</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={downloadCompletePDF}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-red-500/30 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        PDF Report
                      </button>
                      <button
                        onClick={downloadAllData}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 transition-all"
                      >
                        <FileJson className="w-4 h-4" />
                        JSON Data
                      </button>
                    </div>
                  </div>

                  {/* Individual Section Downloads */}
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 mb-1.5">Individual Sections</div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Properties */}
                      <button
                        onClick={downloadPropertiesPDF}
                        disabled={!attomData.data?.properties?.length}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-red-600 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        title="Download Properties as PDF"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Properties PDF</span>
                      </button>
                      <button
                        onClick={downloadProperties}
                        disabled={!attomData.data?.properties?.length}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-emerald-600 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download Properties as JSON"
                      >
                        <FileJson className="w-3 h-3" />
                        <span>Properties JSON</span>
                      </button>

                      {/* POI */}
                      <button
                        onClick={downloadPOIPDF}
                        disabled={!attomData.data?.pois?.length}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-red-600 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download POI Data as PDF"
                      >
                        <FileText className="w-3 h-3" />
                        <span>POI PDF</span>
                      </button>
                      <button
                        onClick={downloadPOIData}
                        disabled={!attomData.data?.pois?.length}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-emerald-600 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download POI Data as JSON"
                      >
                        <FileJson className="w-3 h-3" />
                        <span>POI JSON</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Debug Info */}
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-300">
                      <div className="font-semibold mb-1">Data Availability Status:</div>
                      {attomData.summary?.averagePrice > 0 ? (
                        <div>✓ Price data available from {attomData.data?.properties?.filter(p => 
                          p.sale?.amount?.saleamt || p.assessment?.assessed?.assdttlvalue
                        ).length} properties</div>
                      ) : (
                        <div>
                          <div className="mb-2">⚠️ <strong>Limited Data from Property Snapshot API</strong></div>
                          <div className="space-y-1 ml-4">
                            <div>✅ Property addresses: {attomData.data?.properties?.length || 0}</div>
                            <div>✅ Geographic locations</div>
                            <div>❌ Price data (Coming Soon - Premium API)</div>
                            <div>❌ Beds/Baths (Coming Soon - Premium API)</div>
                            <div>❌ Area demographics (Coming Soon - Premium API)</div>
                          </div>
                          <div className="mt-2 text-amber-200">
                            💡 <strong>Solution:</strong> The Property Snapshot API returns basic info only. 
                            Full property details with prices, beds/baths coming soon with Property Detail API integration.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* API Limitations Notice */}
                {attomData.summary?.averagePrice === 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-start gap-2">
                      <FileJson className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-300">
                        <div className="font-semibold mb-1">🚀 Coming Soon - Full Property Details:</div>
                        <div className="space-y-1">
                          <div>✨ Property prices and valuations</div>
                          <div>✨ Bedrooms, bathrooms, square footage</div>
                          <div>✨ Complete area demographics</div>
                          <div>✨ Enhanced community insights</div>
                          <div className="mt-2 text-blue-200">Property Detail API integration in progress!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Documentation Modal */}
      {showDocumentation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Market Summary Guide</h2>
              </div>
              <button
                onClick={() => setShowDocumentation(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-all"
                title="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-6 space-y-6">
              {/* Introduction */}
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <h3 className="text-lg font-bold text-cyan-400 mb-2">What is Market Summary?</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The Market Summary provides comprehensive real estate market analysis for any ZIP code in the United States. 
                  It combines data from multiple sources including property records, demographic information, and points of interest 
                  to give you a complete picture of the local real estate market.
                </p>
              </div>

              {/* Key Metrics Section */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Key Metrics Explained
                </h3>
                <div className="grid gap-4">
                  {/* Total Properties */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <Home className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">Total Properties</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          The number of properties found in the searched ZIP code area. This gives you an idea of the 
                          market size and availability. More properties typically indicate a larger, more active market.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Average Price */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">Average Price</h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-2">
                          The mean price of all properties in the area. This metric helps you understand the overall 
                          affordability and market level. 
                        </p>
                        <div className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded inline-block">
                          � Coming Soon - Property Detail API integration for full pricing data!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Investment Score */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">Investment Score (0-100)</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          A calculated metric that evaluates the investment potential of the area based on multiple factors:
                        </p>
                        <ul className="text-xs text-slate-400 mt-2 space-y-1 ml-4 list-disc">
                          <li>Property availability and market size</li>
                          <li>Price trends and appreciation potential</li>
                          <li>Amenities and infrastructure (POIs)</li>
                          <li>Area demographics and growth patterns</li>
                          <li>Community features and livability</li>
                        </ul>
                        <div className="mt-2 text-xs">
                          <span className="text-emerald-400">80-100:</span> <span className="text-slate-400">Excellent</span> |
                          <span className="text-blue-400 ml-2">60-79:</span> <span className="text-slate-400">Good</span> |
                          <span className="text-yellow-400 ml-2">40-59:</span> <span className="text-slate-400">Fair</span> |
                          <span className="text-red-400 ml-2">0-39:</span> <span className="text-slate-400">Poor</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Trend */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">Market Trend</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Indicates the current direction of the market (Growing, Stable, or Declining). This helps you 
                          understand whether it's a buyer's or seller's market and the overall market momentum.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sections */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Data Sections
                </h3>
                <div className="grid gap-4">
                  {/* Properties */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <Home className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">📍 Properties</h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-2">
                          Detailed list of all properties in the area including:
                        </p>
                        <ul className="text-xs text-slate-400 space-y-1 ml-4 list-disc">
                          <li><strong>Address:</strong> Full street address of each property</li>
                          <li><strong>Location:</strong> City, state, and ZIP code</li>
                          <li><strong>Coordinates:</strong> Latitude and longitude for mapping</li>
                          <li><strong>Property Details:</strong> Beds, baths, square footage (requires Detail API)</li>
                        </ul>
                        <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                          ⚠️ Currently limited to 50 properties per search
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Area Data */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">🗺️ Area Data (Demographics)</h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-2">
                          Demographic and statistical information about the ZIP code area:
                        </p>
                        <ul className="text-xs text-slate-400 space-y-1 ml-4 list-disc">
                          <li><strong>Population:</strong> Total residents in the area</li>
                          <li><strong>Median Income:</strong> Average household income</li>
                          <li><strong>Age Distribution:</strong> Demographics by age groups</li>
                          <li><strong>Education Levels:</strong> Educational attainment statistics</li>
                          <li><strong>Housing Stats:</strong> Owner vs. renter percentages</li>
                        </ul>
                        <div className="mt-2 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                          🚀 Coming Soon - Premium API Integration
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Community Data */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">🏘️ Community Data</h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-2">
                          Information about the community and neighborhood features:
                        </p>
                        <ul className="text-xs text-slate-400 space-y-1 ml-4 list-disc">
                          <li><strong>Crime Rates:</strong> Safety statistics for the area</li>
                          <li><strong>School Ratings:</strong> Quality of local schools</li>
                          <li><strong>Walkability Score:</strong> How pedestrian-friendly the area is</li>
                          <li><strong>Transit Score:</strong> Public transportation access</li>
                          <li><strong>Bike Score:</strong> Bicycle infrastructure quality</li>
                        </ul>
                        <div className="mt-2 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                          🚀 Coming Soon - Enhanced Community Features
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* POI Data */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">📍 POI (Points of Interest)</h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-2">
                          Nearby amenities and facilities that affect property value and livability:
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          <div className="flex items-center gap-2 text-slate-400">
                            <ShoppingBag className="w-4 h-4 text-emerald-400" />
                            <span>Shopping Centers</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <GraduationCap className="w-4 h-4 text-blue-400" />
                            <span>Schools & Universities</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Hospital className="w-4 h-4 text-red-400" />
                            <span>Hospitals & Clinics</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <TreePine className="w-4 h-4 text-green-400" />
                            <span>Parks & Recreation</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                          POI data helps evaluate neighborhood amenities, walkability, and convenience factors 
                          that significantly impact property values and quality of life.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-400" />
                  Export Options
                </h3>
                <div className="grid gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">📄 PDF Reports</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Professional, formatted reports perfect for presentations, client meetings, or printing. 
                          Includes branded headers, formatted tables, and automatic pagination.
                        </p>
                        <div className="text-xs text-emerald-400 mt-2">
                          Best for: Sharing, presentations, printed materials, client reports
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <FileJson className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-1">📋 JSON Data</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Raw data in JSON format for further analysis, API integration, or custom processing. 
                          Includes all available fields and nested data structures.
                        </p>
                        <div className="text-xs text-blue-400 mt-2">
                          Best for: Data analysis, API integration, custom reporting, development
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Use */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">🚀 How to Use</h3>
                <ol className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="font-bold text-cyan-400">1.</span>
                    <span>Enter a valid 5-digit ZIP code in the search box</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-cyan-400">2.</span>
                    <span>Click "Search Market Data" and wait 2-3 seconds for data to load</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-cyan-400">3.</span>
                    <span>Review the market summary, investment score, and available data sections</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-cyan-400">4.</span>
                    <span>Download PDF reports for sharing or JSON data for analysis</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-cyan-400">5.</span>
                    <span>For full property details (prices, beds/baths), use the Property Detail API</span>
                  </li>
                </ol>
              </div>

              {/* Coming Soon Features */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
                <h3 className="text-lg font-bold text-blue-400 mb-3">🚀 Coming Soon - Premium Features</h3>
                <ul className="space-y-2 text-sm text-slate-300 list-disc ml-4">
                  <li>✨ <strong>Property Details API:</strong> Prices, beds/baths, square footage for all properties</li>
                  <li>✨ <strong>Area Demographics:</strong> Population, income, education statistics</li>
                  <li>✨ <strong>Enhanced Community Data:</strong> Crime rates, school ratings, walkability scores</li>
                  <li>✨ <strong>Expanded Property Listings:</strong> More than 50 properties per search</li>
                  <li>✨ <strong>Historical Data:</strong> Price trends and market history</li>
                  <li>✨ <strong>Advanced Analytics:</strong> Investment insights and ROI calculations</li>
                </ul>
                <div className="mt-3 text-xs text-blue-300 bg-blue-500/10 px-3 py-2 rounded">
                  💡 We're actively working on integrating premium API features to bring you comprehensive real estate data!
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  For more information, see the documentation files: 
                  <span className="text-cyan-400"> FINAL_ATTOM_STATUS.md, PDF_EXPORT_GUIDE.md</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}