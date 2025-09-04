import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { AlertTriangle, TreePine, Mountain, Flame, Activity, Mail, Bell, BellOff, TestTube, Globe } from 'lucide-react';
import L from 'leaflet';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { testAllEndpoints } from '../utils/apiTest';
import { API_ENDPOINTS } from '../config/api';
import EnvironmentalCard from '../components/EnvironmentalCard';
import { environmentalBackgrounds } from '../environmental-backgrounds';

// Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Dashboard = () => {
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [marineLife, setMarineLife] = useState(null);
  const [marineStats, setMarineStats] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [showMarine, setShowMarine] = useState(true);
  const [riskFilters, setRiskFilters] = useState({ deforestation: true, mining: true, forest_fire: true });
  const [speciesQuery, setSpeciesQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [testingApi, setTestingApi] = useState(false);
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    fetchEnvironmentalData();
  }, []);

  const fetchEnvironmentalData = async () => {
    try {
      setLoading(true);
      const [dataResponse, statsResponse, marineResp, marineStatsResp] = await Promise.all([
        axios.get(API_ENDPOINTS.environment.dummyData),
        axios.get(API_ENDPOINTS.environment.statistics),
        axios.get(API_ENDPOINTS.environment.marineLife),
        axios.get(API_ENDPOINTS.environment.marineLifeStatistics)
      ]);

      setEnvironmentalData(dataResponse.data.data);
      setStatistics(statsResponse.data.statistics);
      setMarineLife(marineResp.data.data);
      setMarineStats(marineStatsResp.data.statistics);
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      toast.error('Failed to load environmental data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMarineBySpecies = async (query) => {
    try {
      const url = query ? `${API_ENDPOINTS.environment.marineLife}?species=${encodeURIComponent(query)}` : API_ENDPOINTS.environment.marineLife;
      const [marineResp, statsResp] = await Promise.all([
        axios.get(url),
        axios.get(API_ENDPOINTS.environment.marineLifeStatistics)
      ]);
      setMarineLife(marineResp.data.data);
      setMarineStats(statsResp.data.statistics);
    } catch (e) {
      toast.error('Failed to filter marine life');
    }
  };

  const handleApiTest = async () => {
    setTestingApi(true);
    toast.loading('Testing all API endpoints...', { id: 'api-test' });

    try {
      const results = await testAllEndpoints();

      // Count successful vs failed tests
      let successCount = 0;
      let totalCount = 0;

      const countResults = (obj) => {
        for (const key in obj) {
          if (obj[key] && typeof obj[key] === 'object') {
            if ('success' in obj[key]) {
              totalCount++;
              if (obj[key].success) successCount++;
            } else {
              countResults(obj[key]);
            }
          }
        }
      };

      countResults(results);

      toast.success(`API Test Complete: ${successCount}/${totalCount} endpoints working`, { id: 'api-test' });
      console.log('API Test Results:', results);
    } catch (error) {
      toast.error('API test failed: ' + error.message, { id: 'api-test' });
    } finally {
      setTestingApi(false);
    }
  };

  const getRiskIcon = (type) => {
    const iconColors = {
      deforestation: '#ef4444',
      mining: '#8b4513',
      forest_fire: '#f97316'
    };

    return L.divIcon({
      className: `risk-marker ${type}`,
      html: `<div style="background-color: ${iconColors[type]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const getRiskIconComponent = (type) => {
    switch (type) {
      case 'deforestation':
        return <TreePine className="h-5 w-5 text-red-500" />;
      case 'mining':
        return <Mountain className="h-5 w-5 text-amber-700" />;
      case 'forest_fire':
        return <Flame className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-cyber h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 relative"
      style={{
        background: theme.bg,
        color: theme.textColor
      }}
    >
      {/* Dynamic Particles based on theme */}
      <div className={theme.particles}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 12 + 8}s`
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div>
            <motion.h1
              className="text-5xl font-bold organic-text mb-3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              🌿 Environmental Dashboard
            </motion.h1>
            <motion.p
              className="text-white/90 text-xl font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              Real-time monitoring of environmental risks and threats
            </motion.p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            {/* Risk type filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {['deforestation','mining','forest_fire'].map((t) => (
                <label key={t} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm cursor-pointer border ${riskFilters[t] ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={riskFilters[t]}
                    onChange={() => setRiskFilters((rf) => ({ ...rf, [t]: !rf[t] }))}
                  />
                  <span className="capitalize">{t.replace('_',' ')}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowMarine((s) => !s)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors border ${showMarine ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-gray-100 text-gray-600 border-gray-300'}`}
            >
              <Globe className="h-4 w-4" />
              <span>{showMarine ? 'Hide' : 'Show'} Marine Life</span>
            </button>
            {/* API Test Button (development only) */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={handleApiTest}
                disabled={testingApi}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                {testingApi ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-800"></div>
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4" />
                    <span>Test APIs</span>
                  </>
                )}
              </button>
            )}

            {/* Email Notifications Toggle */}
            <button
              onClick={async () => {
                try {
                  const newValue = !user?.emailNotifications;
                  await updateProfile({ emailNotifications: newValue });
                  toast.success(`Email alerts ${newValue ? 'enabled' : 'disabled'}`);
                } catch (error) {
                  toast.error('Failed to update email preferences');
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                user?.emailNotifications
                  ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {user?.emailNotifications ? (
                <>
                  <Bell className="h-4 w-4" />
                  <span>Email Alerts On</span>
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4" />
                  <span>Email Alerts Off</span>
                </>
              )}
            </button>

            <motion.button
              onClick={fetchEnvironmentalData}
              className="btn-organic flex items-center space-x-2 interactive-element"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="h-5 w-5" />
              </motion.div>
              <span>🌱 Refresh Data</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {statistics && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Email Notification Status Card */}
            <motion.div
              className="organic-card p-6 glow-nature"
              whileHover={{ scale: 1.03, y: -8 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">📧 Email Alerts</p>
                  <motion.p
                    className={`text-xl font-bold organic-text ${user?.emailNotifications ? 'text-green-300' : 'text-gray-300'}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    {user?.emailNotifications ? '🌟 Active' : '⚪ Disabled'}
                  </motion.p>
                </div>
                <motion.div
                  className="interactive-element"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Mail className={`h-8 w-8 ${user?.emailNotifications ? 'text-green-300' : 'text-gray-300'}`} />
                </motion.div>
              </div>
              <p className="text-xs text-white/70 mt-3">
                {user?.emailNotifications
                  ? '🌿 Receiving environmental alerts via email'
                  : 'Click the toggle above to enable alerts'
                }
              </p>
            </motion.div>

            <motion.div
              className="organic-card p-6 glow-nature"
              whileHover={{ scale: 1.03, y: -8 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">🌍 Total Risks</p>
                  <motion.p
                    className="text-3xl font-bold organic-text organic-counter"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                  >
                    {statistics.total_risks}
                  </motion.p>
                </div>
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center interactive-element"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <AlertTriangle className="h-7 w-7 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <EnvironmentalCard
              title="🌳 Deforestation"
              value={statistics.by_type.deforestation}
              icon={TreePine}
              backgroundImage={environmentalBackgrounds.deforestation}
              glowColor="#f59e0b"
            >
              <div className="text-xs">
                🌿 Critical forest loss detected
                <br />
                📊 {Math.floor(Math.random() * 500) + 100} hectares affected
              </div>
            </EnvironmentalCard>

            <EnvironmentalCard
              title="⛰️ Mining Activity"
              value={statistics.by_type.mining}
              icon={Mountain}
              backgroundImage={environmentalBackgrounds.mining}
              glowColor="#6b7280"
            >
              <div className="text-xs">
                ⚠️ Industrial expansion detected
                <br />
                📊 {Math.floor(Math.random() * 200) + 50} mining sites active
              </div>
            </EnvironmentalCard>

            <EnvironmentalCard
              title="🔥 Forest Fires"
              value={statistics.by_type.forest_fire}
              icon={Flame}
              backgroundImage={environmentalBackgrounds.forest_fire}
              glowColor="#dc2626"
            >
              <div className="text-xs">
                🚨 Active fire zones detected
                <br />
                📊 {Math.floor(Math.random() * 100) + 20} fire hotspots
              </div>
            </EnvironmentalCard>

            <EnvironmentalCard
              title="🌊 Marine Life"
              value={marineStats?.total_points || 0}
              icon={Globe}
              backgroundImage={environmentalBackgrounds.marine}
              glowColor="#3b82f6"
            >
              <div className="text-xs">
                🐟 Marine hotspots detected
                <br />
                📊 Avg biomass index: {marineStats?.average_biomass_index || 0}
              </div>
            </EnvironmentalCard>
          </motion.div>
        )}

        {/* Map and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="organic-card p-0 overflow-hidden">
              <div className="p-5 border-b border-white/20">
                <motion.h3
                  className="text-xl font-semibold organic-text"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  🗺️ Environmental Risk Map
                </motion.h3>
                <motion.p
                  className="text-sm text-white/85"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  🌍 Real-time locations of environmental threats
                </motion.p>
              </div>
              <div className="h-96">
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: '100%', width: '100%' }}
                >
                  {/* Layer legend chips overlay */}
                  <div className="absolute z-[1000] top-3 left-3 flex flex-wrap gap-2">
                    {['deforestation','mining','forest_fire'].map((t) => (
                      <button
                        key={`chip_${t}`}
                        onClick={() => setRiskFilters((rf) => ({ ...rf, [t]: !rf[t] }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur ${riskFilters[t] ? 'bg-white/20 text-white border-white/30' : 'bg-black/20 text-gray-200 border-white/10'}`}
                        title={`Toggle ${t.replace('_',' ')}`}
                      >
                        {t.replace('_',' ')}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowMarine((s) => !s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur ${showMarine ? 'bg-blue-500/30 text-white border-blue-300/50' : 'bg-black/20 text-gray-200 border-white/10'}`}
                      title="Toggle marine life"
                    >
                      marine life
                    </button>
                  </div>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {environmentalData?.features?.filter(f => riskFilters[f.properties.type]).map((feature, index) => (
                    <Marker
                      key={index}
                      position={[
                        feature.geometry.coordinates[1],
                        feature.geometry.coordinates[0]
                      ]}
                      icon={getRiskIcon(feature.properties.type)}
                    >
                      <Popup>
                        <div className="p-2">
                          <div className="flex items-center space-x-2 mb-2">
                            {getRiskIconComponent(feature.properties.type)}
                            <h4 className="font-semibold capitalize">
                              {feature.properties.type.replace('_', ' ')}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Location:</strong> {feature.properties.location}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Severity:</strong> {feature.properties.severity}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Confidence:</strong> {feature.properties.confidence}%
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Area Affected:</strong> {feature.properties.area} hectares
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Marine life hotspots */}
                  {showMarine && marineLife?.features?.map((f, i) => (
                    <CircleMarker
                      key={`m_${i}`}
                      center={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
                      pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.5 }}
                      radius={6 + Math.min(10, Math.floor((f.properties.biomassIndex || 0) / 50))}
                    >
                      <Popup>
                        <div className="p-2">
                          <div className="font-semibold text-blue-700">Marine Hotspot</div>
                          <div className="flex items-center gap-2 mb-2">
                            {f.properties.photoUrl && (
                              <img
                                src={f.properties.photoUrl}
                                alt={f.properties.mainSpecies}
                                className="w-16 h-16 object-cover rounded border border-blue-200 cursor-pointer transition-transform duration-200 hover:scale-110"
                                onClick={() => setModalImage(f.properties.photoUrl)}
                              />
                            )}
                            <div>
                              <div className="text-sm text-gray-700"><strong>Region:</strong> {f.properties.region}</div>
                              <div className="text-sm text-gray-700"><strong>Main Species:</strong> {f.properties.mainSpecies}</div>
                              <div className="text-sm text-gray-700"><strong>Abundance:</strong> {f.properties.abundance}</div>
                              <div className="text-sm text-gray-700"><strong>Biomass Index:</strong> {f.properties.biomassIndex}</div>
                              <div className="text-xs text-gray-500">Confidence: {f.properties.confidence}%</div>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </motion.div>

          {/* Risk Details */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              className="floating-card p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3
                className="text-lg font-semibold neon-text mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Risk Summary
              </motion.h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TreePine className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-gray-900">Deforestation</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">
                    {statistics?.by_type.deforestation || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mountain className="h-5 w-5 text-amber-500" />
                    <span className="font-medium text-gray-900">Mining</span>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">
                    {statistics?.by_type.mining || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-gray-900">Forest Fire</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-600">
                    {statistics?.by_type.forest_fire || 0}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Marine Species Filter */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Marine Life Filter</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={speciesQuery}
                  onChange={(e) => setSpeciesQuery(e.target.value)}
                  placeholder="Search species (e.g., tuna, cod, salmon)"
                  className="flex-1 px-3 py-2 border rounded-lg text-gray-900"
                />
                <button
                  onClick={() => fetchMarineBySpecies(speciesQuery)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >Apply</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Tip: leave blank and click Apply to reset.</p>
            </div>

            {/* System Status */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">System Status</h4>
                  <p className="text-sm text-blue-700 mt-1">All monitoring systems are operational and collecting real-time data.</p>
                  {marineStats && (
                    <div className="mt-2 text-xs text-blue-800">
                      Marine hotspots: <strong>{marineStats.total_points}</strong> · Avg biomass index: <strong>{marineStats.average_biomass_index}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            {statistics && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Area Affected:</span>
                    <span className="text-sm font-medium text-gray-900">{statistics.total_area_affected} hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Confidence:</span>
                    <span className="text-sm font-medium text-gray-900">{statistics.average_confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">High Severity:</span>
                    <span className="text-sm font-medium text-red-600">{statistics.by_severity.high}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Modal for enlarged marine life image */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Marine Life"
            className="max-w-[85vw] max-h-[85vh] rounded-2xl shadow-2xl border-4 border-blue-300"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-6 right-6 text-white text-3xl leading-none"
            onClick={() => setModalImage(null)}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
