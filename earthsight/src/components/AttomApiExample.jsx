import { useState, useEffect } from 'react'
import {
  getComprehensiveMarketAnalysis,
  getPropertyDetail,
  getPropertySnapshot
} from '../services/attomDataService'
import { showToast } from './FuturisticToast'

/**
 * Example component demonstrating ATTOM API usage
 * Shows how to fetch and display real estate data
 */
export function AttomApiExample() {
  const [searchType, setSearchType] = useState('postal') // 'postal' or 'coords'
  const [postalCode, setPostalCode] = useState('82009')
  const [latitude, setLatitude] = useState('39.7047')
  const [longitude, setLongitude] = useState('-105.0814')
  const [radius, setRadius] = useState('2')
  const [loading, setLoading] = useState(false)
  const [marketData, setMarketData] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)

  /**
   * Fetch comprehensive market analysis
   */
  const handleSearchMarket = async () => {
    setLoading(true)
    setMarketData(null)
    setSelectedProperty(null)

    try {
      const params =
        searchType === 'postal'
          ? { postalcode: postalCode }
          : {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              radius: parseFloat(radius)
            }

      console.log('Fetching market data with params:', params)

      const result = await getComprehensiveMarketAnalysis(params)

      if (result.success) {
        setMarketData(result)
        showToast(
          `✅ Found ${result.metadata.propertyCount} properties!`,
          'success'
        )
        console.log('Market data received:', result)
      } else {
        showToast(`❌ ${result.error}`, 'error')
        console.error('API Error:', result.error)
      }
    } catch (error) {
      showToast('❌ Failed to fetch market data', 'error')
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch detailed information for a specific property
   */
  const handlePropertyClick = async (property) => {
    const propertyId = property.identifier?.attomId

    if (!propertyId) {
      showToast('⚠️ Property ID not available', 'warning')
      return
    }

    setLoading(true)

    try {
      const result = await getPropertyDetail(propertyId)

      if (result.success) {
        setSelectedProperty(result.property)
        showToast('✅ Property details loaded', 'success')
        console.log('Property details:', result.property)
      } else {
        showToast(`❌ ${result.error}`, 'error')
      }
    } catch (error) {
      showToast('❌ Failed to fetch property details', 'error')
      console.error('Property detail error:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Format currency values
   */
  const formatCurrency = (value) => {
    if (!value || value === 0) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  /**
   * Format numbers with commas
   */
  const formatNumber = (value) => {
    if (!value || value === 0) return 'N/A'
    return new Intl.NumberFormat('en-US').format(value)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Search Controls */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          ATTOM API Property Search
        </h2>

        {/* Search Type Toggle */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setSearchType('postal')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              searchType === 'postal'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Search by ZIP Code
          </button>
          <button
            onClick={() => setSearchType('coords')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              searchType === 'coords'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Search by Coordinates
          </button>
        </div>

        {/* Search Inputs */}
        {searchType === 'postal' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Postal Code (ZIP)
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g., 82009"
                maxLength={5}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchMarket()}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="39.7047"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-105.0814"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Radius (miles)
              </label>
              <input
                type="text"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="2"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSearchMarket}
          disabled={loading}
          className="mt-4 w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Searching...' : 'Search Properties'}
        </button>
      </div>

      {/* Market Summary */}
      {marketData && marketData.summary && (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-6">
            Market Analysis Summary
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Total Properties</div>
              <div className="text-2xl font-bold text-white">
                {marketData.summary.totalProperties}
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Average Price</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(marketData.summary.averagePrice)}
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Median Price</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(marketData.summary.medianPrice)}
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Investment Score</div>
              <div className="text-2xl font-bold text-cyan-400">
                {marketData.summary.investmentScore}/100
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Price/Sq Ft</div>
              <div className="text-xl font-bold text-white">
                ${formatNumber(marketData.summary.pricePerSqFt)}
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Market Trend</div>
              <div className="text-xl font-bold text-emerald-400">
                {marketData.summary.trend}
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Price Change</div>
              <div className="text-xl font-bold text-emerald-400">
                {marketData.summary.priceChange}
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Median Home Value</div>
              <div className="text-xl font-bold text-white">
                {formatCurrency(marketData.summary.medianHomeValue)}
              </div>
            </div>
          </div>

          {/* Amenities */}
          {marketData.summary.amenities &&
            marketData.summary.amenities.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">
                  Property Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {marketData.summary.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Recent Listings */}
          {marketData.summary.recentListings &&
            marketData.summary.recentListings.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">
                  Sample Listings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {marketData.summary.recentListings.map((listing, idx) => (
                    <div key={idx} className="bg-slate-700 rounded-lg p-4">
                      <div className="text-cyan-400 font-semibold">
                        {listing.type}
                      </div>
                      <div className="text-2xl font-bold text-white mt-1">
                        {listing.price}
                      </div>
                      <div className="text-slate-400 text-sm mt-1">
                        {listing.area}
                      </div>
                      <div className="text-slate-400 text-xs mt-2">
                        {listing.address}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Properties List */}
      {marketData && marketData.data && marketData.data.properties && (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4">
            Properties ({marketData.data.properties.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.data.properties.slice(0, 12).map((property, idx) => (
              <div
                key={idx}
                onClick={() => handlePropertyClick(property)}
                className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-all"
              >
                <div className="text-white font-semibold mb-2">
                  {property.address?.line1 || 'Address N/A'}
                </div>
                <div className="text-slate-300 text-sm mb-2">
                  {property.address?.locality}, {property.address?.countrySubd}{' '}
                  {property.address?.postal1}
                </div>

                <div className="flex gap-4 text-sm text-slate-400 mb-2">
                  <span>🛏️ {property.building?.rooms?.beds || 'N/A'} beds</span>
                  <span>
                    🚿 {property.building?.rooms?.bathstotal || 'N/A'} baths
                  </span>
                </div>

                <div className="text-sm text-slate-400 mb-2">
                  📐{' '}
                  {formatNumber(
                    property.building?.size?.universalsize ||
                      property.building?.size?.bldgsize
                  )}{' '}
                  sq ft
                </div>

                <div className="text-cyan-400 font-bold text-lg">
                  {formatCurrency(
                    property.sale?.amount?.saleamt ||
                      property.assessment?.assessed?.assdttlvalue
                  )}
                </div>

                {property.summary?.yearbuilt && (
                  <div className="text-slate-400 text-xs mt-2">
                    Built: {property.summary.yearbuilt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Property Detail Modal/Panel */}
      {selectedProperty && (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4">
            Property Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                Address
              </h4>
              <p className="text-white">{selectedProperty.address?.full}</p>
            </div>

            {/* Characteristics */}
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                Characteristics
              </h4>
              <div className="space-y-1 text-slate-300">
                <p>Bedrooms: {selectedProperty.characteristics?.bedrooms}</p>
                <p>Bathrooms: {selectedProperty.characteristics?.bathrooms}</p>
                <p>
                  Square Feet:{' '}
                  {formatNumber(selectedProperty.characteristics?.squareFeet)}
                </p>
                <p>
                  Lot Size:{' '}
                  {formatNumber(selectedProperty.characteristics?.lotSize)} sq
                  ft
                </p>
                <p>Year Built: {selectedProperty.characteristics?.yearBuilt}</p>
                <p>Stories: {selectedProperty.characteristics?.stories}</p>
              </div>
            </div>

            {/* Sale Info */}
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                Sale Information
              </h4>
              <div className="space-y-1 text-slate-300">
                <p>
                  Last Sale Price:{' '}
                  {formatCurrency(selectedProperty.sale?.lastSalePrice)}
                </p>
                <p>Last Sale Date: {selectedProperty.sale?.lastSaleDate}</p>
              </div>
            </div>

            {/* Valuation */}
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                Valuation
              </h4>
              <div className="space-y-1 text-slate-300">
                <p>
                  Assessed Value:{' '}
                  {formatCurrency(selectedProperty.valuation?.assessedValue)}
                </p>
                <p>
                  Market Value:{' '}
                  {formatCurrency(selectedProperty.valuation?.marketValue)}
                </p>
                <p>
                  Tax Amount:{' '}
                  {formatCurrency(selectedProperty.valuation?.taxAmount)}
                </p>
                <p>Tax Year: {selectedProperty.valuation?.taxYear}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedProperty(null)}
            className="mt-6 px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all"
          >
            Close Details
          </button>
        </div>
      )}

      {/* No Results */}
      {!loading && !marketData && (
        <div className="bg-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg">
            Enter a ZIP code or coordinates above to search for properties
          </p>
        </div>
      )}
    </div>
  )
}

export default AttomApiExample
