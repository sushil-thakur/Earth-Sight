import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Home, 
  Calculator, 
  Download, 
  TrendingUp, 
  MapPin, 
  Layers,
  Square,
  Bed,
  Bath,
  Calendar,
  Brain,
} from 'lucide-react';
  // BarChart3
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS, REQUEST_CONFIG } from '../config/api';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    floors: 1,
    area: 1000,
    bedrooms: 2,
    bathrooms: 1,
    age: 5,
  location: 'Los Angeles',
  lat: null,
  lng: null
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const locations = [
    'Los Angeles',
    'New York',
    'San Francisco',
    'Chicago',
    'Miami',
    'Seattle',
    'Austin',
    'Denver',
    'Boston',
    'Portland'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
  [name]: name === 'location' ? value : parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.prediction.predict, formData);
      setPrediction(response.data);
      toast.success('Prediction generated successfully!');
    } catch (error) {
      console.error('Prediction error:', error);
      const message = error.response?.data?.error || 'Failed to generate prediction';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Map click handler component
  const LocationPicker = ({ onPick }) => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        // Reverse geocode using Nominatim
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();
          const placeName = data.address?.city || data.address?.town || data.address?.village || data.address?.county || data.display_name || `${lat},${lng}`;
          setFormData(prev => ({ ...prev, lat, lng, location: placeName }));
        } catch {
          setFormData(prev => ({ ...prev, lat, lng, location: `${lat},${lng}` }));
        }
        try {
          localStorage.setItem('predictionLat', String(lat));
          localStorage.setItem('predictionLng', String(lng));
        } catch {}
        if (onPick) onPick({ lat, lng });
      }
    });
    return null;
  };

  // Fix Leaflet default icon in React
  const DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  const handleDownloadReport = async () => {
    if (!prediction) {
      toast.error('No prediction data available');
      return;
    }

    setGeneratingReport(true);
    try {
      const response = await axios.post(API_ENDPOINTS.pdf.generateReport, {
        predictionData: prediction,
        userInput: formData
      }, {
        ...REQUEST_CONFIG.pdfBlob
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `earthslight-report-${Date.now()}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Report generation error:', error);
      const message = error.response?.data?.error || 'Failed to generate report';
      toast.error(message);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Load last selected coordinates on mount
  useEffect(() => {
    try {
      const savedLat = localStorage.getItem('predictionLat');
      const savedLng = localStorage.getItem('predictionLng');
      if (savedLat && savedLng) {
        const lat = parseFloat(savedLat);
        const lng = parseFloat(savedLng);
        if (!isNaN(lat) && !isNaN(lng)) {
          setFormData(prev => ({ ...prev, lat, lng, location: `${lat.toFixed(5)},${lng.toFixed(5)}` }));
        }
      }
    } catch {}
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold gradient-text mb-2">AI-Powered Real Estate Prediction</h1>
          <p className="text-gray-300 text-lg">
            Advanced machine learning algorithms for accurate property valuation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prediction Form */}
          <div className="space-y-6">
            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-cyan-500 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Property Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="form-label">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Location (Select or pick on map)
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Or click on the map to set precise coordinates.</p>
                    {formData.lat != null && formData.lng != null && (
                      <div className="text-xs text-gray-400 mt-1">
                        Selected: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="area" className="form-label">
                      <Square className="h-4 w-4 inline mr-2" />
                      Area (sq ft)
                    </label>
                    <input
                      type="number"
                      id="area"
                      name="area"
                      min="100"
                      max="10000"
                      value={formData.area}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="bedrooms" className="form-label">
                      <Bed className="h-4 w-4 inline mr-2" />
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      name="bedrooms"
                      min="1"
                      max="10"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="bathrooms" className="form-label">
                      <Bath className="h-4 w-4 inline mr-2" />
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      name="bathrooms"
                      min="1"
                      max="10"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="floors" className="form-label">
                      <Layers className="h-4 w-4 inline mr-2" />
                      Floors
                    </label>
                    <input
                      type="number"
                      id="floors"
                      name="floors"
                      min="1"
                      max="50"
                      value={formData.floors}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="form-label">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Age (years)
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      min="0"
                      max="100"
                      value={formData.age}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Global Map Picker */}
                <div className="h-72 rounded-lg overflow-hidden border border-neon-blue/20">
                  <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <LocationPicker onPick={({ lat, lng }) => {
                      setFormData(prev => ({ ...prev, lat, lng, location: `${lat},${lng}` }));
                      try {
                        localStorage.setItem('predictionLat', String(lat));
                        localStorage.setItem('predictionLng', String(lng));
                      } catch {}
                    }} />
                    {formData.lat != null && formData.lng != null && (
                      <Marker position={[formData.lat, formData.lng]} />
                    )}
                  </MapContainer>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex justify-center items-center group"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="spinner-cyber h-4 w-4"></div>
                      <span>Generating Prediction...</span>
                    </div>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Prediction
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Key Factors */}
            {prediction && (
              <div className="card-cyber">
                <h3 className="text-lg font-semibold text-white mb-4">Key Factors</h3>
                <div className="space-y-3">
                  {prediction.prediction.factors.map((factor, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-dark-800/50 border border-neon-blue/20 rounded-lg">
                      <span className="font-medium text-gray-300">{factor.name}</span>
                      <span className="text-sm text-neon-blue font-mono">{factor.impact}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prediction Results */}
          <div className="space-y-6">
            {prediction && (
              <>
                {/* Current Prediction */}
                <div className="card-cyber">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-4">Predicted Price</h3>
                    <div className="text-4xl font-display font-bold gradient-text mb-2">
                      {formatCurrency(prediction.prediction.currentPrice)}
                    </div>
                    <p className="text-sm text-gray-400">
                      Confidence: <span className="text-neon-green">{prediction.prediction.confidence}%</span>
                    </p>
                  </div>
                </div>

                {/* Market Summary */}
                <div className="card-cyber">
                  <h3 className="text-lg font-semibold text-white mb-4">Market Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Market Trend:</span>
                      <span className={`text-sm font-medium capitalize ${
                        prediction.summary.marketTrend === 'increasing' ? 'text-neon-green' :
                        prediction.summary.marketTrend === 'decreasing' ? 'text-neon-red' : 'text-neon-yellow'
                      }`}>
                        {prediction.summary.marketTrend}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Location Score:</span>
                      <span className="text-sm font-medium text-white">{prediction.summary.locationScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Properties Analyzed:</span>
                      <span className="text-sm font-medium text-white">{prediction.summary.totalProperties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Average Market Price:</span>
                      <span className="text-sm font-medium text-white">{formatCurrency(prediction.summary.averagePrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Download Report */}
                <div className="card-cyber">
                  <button
                    onClick={handleDownloadReport}
                    disabled={generatingReport}
                    className="btn-secondary w-full flex justify-center items-center group"
                  >
                    {generatingReport ? (
                      <div className="flex items-center space-x-2">
                        <div className="spinner-cyber h-4 w-4"></div>
                        <span>Generating Report...</span>
                      </div>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 10-Year Forecast Chart */}
        {prediction && (
          <div className="card-cyber">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-purple to-violet-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">10-Year Price Forecast</h2>
            </div>
            
                <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prediction.forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'price') return [formatCurrency(value), 'Price'];
                      if (name === 'growth') return [`${value}%`, 'Growth'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Year: ${label}`}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #3B82F6',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar 
                    dataKey="price" 
                    fill="url(#gradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
              {prediction.forecast.slice(0, 5).map((year, index) => (
                <div key={index} className="text-center p-3 bg-dark-800/50 border border-neon-blue/20 rounded-lg">
                  <div className="text-sm font-medium text-gray-300">{year.year}</div>
                  <div className="text-lg font-bold gradient-text">
                    {formatCurrency(year.price)}
                  </div>
                  <div className={`text-xs font-mono ${
                    parseFloat(year.growth) > 0 ? 'text-neon-green' : 'text-neon-red'
                  }`}>
                    {year.growth}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionForm; 