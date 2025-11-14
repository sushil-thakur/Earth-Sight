const express = require('express');
const router = express.Router();

// Generate dummy environmental risk data
const generateDummyData = () => {
  const risks = [
    {
      type: 'deforestation',
      color: '#FF4444',
      icon: '🌳',
      description: 'Deforestation detected'
    },
    {
      type: 'mining',
      color: '#8B4513',
      icon: '⛏️',
      description: 'Mining activity detected'
    },
    {
      type: 'forest_fire',
      color: '#FF8C00',
      icon: '🔥',
      description: 'Forest fire risk detected'
    }
  ];

  const dummyData = {
    type: 'FeatureCollection',
    features: []
  };

  // Generate random coordinates around the world with real environmental hotspots
  const locations = [
    {
      lat: -12.6097,
      lng: -69.1897,
      name: 'Madre de Dios, Peru (illegal gold mining & deforestation)',
      latestData: 'Between 1984 – first half 2025: ~139,169 ha deforested by gold mining; ~550 ha of peatland lost in last 2 years.'
    },
    {
      lat: -3.2040,
      lng: -52.2070,
      name: 'Pará / Altamira, Brazil (Amazon deforestation hotspots)',
      latestData: 'Aug 2024–Jul 2025: ~5,796 km² deforested in Brazilian Amazon (INPE); 2024 fire season in Amazon was record-high fire hotspots.'
    },
    {
      lat: -4.0533,
      lng: 137.1160,
      name: 'Grasberg / Mimika, Papua, Indonesia (mine disaster & mining impacts)',
      latestData: 'No reliable 2025-specific publicly reported data found for mining-driven deforestation or disaster in this exact location.'
    },
    {
      lat: 62.0355,
      lng: 129.6755,
      name: 'Sakha (Yakutsk), Russia (boreal forest wildfire activity)',
      latestData: '2024–2025 fire season: Sakha was a hotspot; global data shows extreme fire activity in Sakha, with increasing trend. (Copernicus report)'
    },
    {
      lat: 50.2333,
      lng: -121.4333,
      name: 'Lytton area, British Columbia, Canada (recent wildfires)',
      latestData: '2025 B.C. wildfire season: ~886,300 ha burned across B.C. (regional total; Lytton area part of provincial risk).'
    },
    {
      lat: -19.6499,
      lng: 134.1910,
      name: 'Barkly / Tennant Creek, Northern Territory, Australia (bushfire/heat risks)',
      latestData: 'No recent (2025) publicly available quantified data on bushfires or deforestation specific to this area.'
    },
    {
      lat: -2.2096,
      lng: 113.9165,
      name: 'Central Kalimantan (Palangka Raya), Indonesia (peatland deforestation & fire risk)',
      latestData: 'No reliable 2025-specific public data found on peatland fire or deforestation for this exact coordinate.'
    },
    {
      lat: 1.0461,
      lng: 29.6472,
      name: 'Mambasa / Ituri, DRC (forest loss / logging pressure)',
      latestData: 'Publicly accessible 2025-specific logging or deforestation data for this region is limited; no robust number found.'
    },
    {
      lat: 5.6948,
      lng: -76.6541,
      name: 'Atrato River / Quibdó, Colombia (mercury contamination from gold mining)',
      latestData: 'No validated 2025-level data on deforestation or mercury contamination specific to this coordinate found in public sources.'
    },
    {
      lat: 26.8467,
      lng: 80.9462,
      name: 'Uttar Pradesh region, India (seasonal agricultural & forest fires)',
      latestData: 'Could not find publicly reported 2025 data for fire-driven forest loss specific to this part of Uttar Pradesh.'
    }
  ];

  locations.forEach((location, index) => {
    // Determine risk type based on location characteristics
    let risk;
    const locationName = location.name.toLowerCase();
    
    if (locationName.includes('gold mining') || locationName.includes('mine disaster') || locationName.includes('mercury contamination')) {
      risk = risks[1]; // mining - brown ⛏️
    } else if (locationName.includes('wildfire') || locationName.includes('fire risk') || locationName.includes('bushfire')) {
      risk = risks[2]; // forest_fire - orange 🔥
    } else {
      risk = risks[0]; // deforestation - red 🌳
    }

    const severity = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%

    // Add some random variation to coordinates
    const latVariation = (Math.random() - 0.5) * 0.1;
    const lngVariation = (Math.random() - 0.5) * 0.1;

    dummyData.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          location.lng + lngVariation,
          location.lat + latVariation
        ]
      },
      properties: {
        id: `risk_${index + 1}`,
        type: risk.type,
        severity: severity,
        confidence: confidence,
        description: risk.description,
        color: risk.color,
        icon: risk.icon,
        location: location.name,
        latestData: location.latestData,
        timestamp: new Date().toISOString(),
        area: Math.floor(Math.random() * 1000) + 100, // hectares
        impact: {
          trees_affected: Math.floor(Math.random() * 10000) + 1000,
          carbon_emissions: Math.floor(Math.random() * 5000) + 500,
          wildlife_impact: Math.floor(Math.random() * 100) + 10
        }
      }
    });
  });

  return dummyData;
};

// Generate marine life hotspot data (plausible, aligned with known regions)
const generateMarineLifeData = () => {
  // Representative species and known-rich regions (approximate coords in oceans)
  const hotspots = [
    // Pacific Ocean - Tuna belt
    { lat: 10, lng: -150, region: 'Central Pacific', species: [{ name: 'Yellowfin Tuna', abundance: 'High' }, { name: 'Skipjack Tuna', abundance: 'High' }, { name: 'Bigeye Tuna', abundance: 'Medium' }] },
    { lat: -5, lng: -120, region: 'Eastern Pacific', species: [{ name: 'Skipjack Tuna', abundance: 'High' }, { name: 'Yellowfin Tuna', abundance: 'Medium' }] },
    { lat: 15, lng: 160, region: 'Western Pacific', species: [{ name: 'Yellowfin Tuna', abundance: 'High' }, { name: 'Bigeye Tuna', abundance: 'High' }] },
    // North Atlantic - Cod, Herring
    { lat: 52, lng: -20, region: 'North Atlantic', species: [{ name: 'Atlantic Cod', abundance: 'Medium' }, { name: 'Atlantic Herring', abundance: 'High' }, { name: 'Mackerel', abundance: 'Medium' }] },
    { lat: 60, lng: -35, region: 'Labrador Sea', species: [{ name: 'Atlantic Cod', abundance: 'Medium' }, { name: 'Greenland Halibut', abundance: 'Medium' }] },
    // North Pacific - Salmon
    { lat: 55, lng: -160, region: 'Gulf of Alaska', species: [{ name: 'Pacific Salmon', abundance: 'High' }, { name: 'Pollock', abundance: 'High' }] },
    { lat: 50, lng: 155, region: 'Sea of Okhotsk', species: [{ name: 'Pacific Salmon', abundance: 'High' }, { name: 'Herring', abundance: 'Medium' }] },
    // Indian Ocean - Tuna
    { lat: -10, lng: 70, region: 'Western Indian Ocean', species: [{ name: 'Skipjack Tuna', abundance: 'High' }, { name: 'Yellowfin Tuna', abundance: 'Medium' }] },
    { lat: 5, lng: 85, region: 'Central Indian Ocean', species: [{ name: 'Bigeye Tuna', abundance: 'Medium' }, { name: 'Skipjack Tuna', abundance: 'High' }] },
    // South Atlantic - Sardine, Anchovy
    { lat: -30, lng: -40, region: 'South Atlantic', species: [{ name: 'Sardine', abundance: 'Medium' }, { name: 'Anchovy', abundance: 'Medium' }] },
    // Humboldt Current - Anchoveta
    { lat: -10, lng: -80, region: 'Peru Current', species: [{ name: 'Peruvian Anchoveta', abundance: 'High' }, { name: 'Sardine', abundance: 'Medium' }] },
    // Benguela Current - Sardine
    { lat: -20, lng: 5, region: 'Benguela Current', species: [{ name: 'Sardine', abundance: 'High' }, { name: 'Horse Mackerel', abundance: 'Medium' }] },
    // Coral Triangle biodiversity
    { lat: 0, lng: 125, region: 'Coral Triangle', species: [{ name: 'Reef Fish (Various)', abundance: 'High' }, { name: 'Skipjack Tuna', abundance: 'High' }] },
    // Arabian Sea
    { lat: 15, lng: 62, region: 'Arabian Sea', species: [{ name: 'Sardine', abundance: 'High' }, { name: 'Mackerel', abundance: 'Medium' }] },
    // Bay of Bengal
    { lat: 15, lng: 90, region: 'Bay of Bengal', species: [{ name: 'Hilsa', abundance: 'High' }, { name: 'Mackerel', abundance: 'Medium' }] },
    // Mediterranean (open areas)
    { lat: 35, lng: 18, region: 'Central Mediterranean', species: [{ name: 'European Anchovy', abundance: 'Medium' }, { name: 'Sardine', abundance: 'Medium' }] },
    // Tasman Sea
    { lat: -40, lng: 160, region: 'Tasman Sea', species: [{ name: 'Hoki', abundance: 'Medium' }, { name: 'Jack Mackerel', abundance: 'Medium' }] }
  ];

  // Expand with slight variations to create many points
  const features = [];
  hotspots.forEach((h, idx) => {
    const count = 3 + Math.floor(Math.random() * 4); // 3-6 points per hotspot
    for (let i = 0; i < count; i++) {
      const latVar = (Math.random() - 0.5) * 5; // ±2.5°
      const lngVar = (Math.random() - 0.5) * 5; // ±2.5°
      const chosen = h.species[Math.floor(Math.random() * h.species.length)];
      const biomass = Math.floor(50 + Math.random() * 450); // relative biomass index 50-500

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [h.lng + lngVar, h.lat + latVar]
        },
        properties: {
          id: `marine_${idx}_${i}`,
          region: h.region,
          mainSpecies: chosen.name,
          abundance: chosen.abundance,
          speciesMix: h.species,
          biomassIndex: biomass,
          confidence: Math.floor(70 + Math.random() * 25),
          timestamp: new Date().toISOString(),
          type: 'marine_life',
          photoUrl: getMarineLifePhotoUrl(chosen.name),
        }
      });
    }
  });

  return {
    type: 'FeatureCollection',
    features
  };
};

   // Helper to get a photo URL for the species
   // You can replace these URLs with your own hosted images or use public domain images
   function getMarineLifePhotoUrl(speciesName) {
     const photos = {
       'Yellowfin Tuna': 'https://commons.wikimedia.org/wiki/Special:FilePath/Thunnus_albacares.png',
  'Skipjack Tuna': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFc-v2ZAOluyw4spXq1X_i_e44utA61RaMbA&s',
  'Bigeye Tuna': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROcpiWLQGhimfsIF1yqBzSHHpYnouxwuDmHA&s',
  'Atlantic Cod': 'https://www.thefisherman.com/wp-content/uploads/2019/04/2019-2-profiling-the-atlantic-cod-cod.jpg',
  'Atlantic Herring': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHJ89uy7S3QrlJvUq2XyVuQuN6FSdedxG7TA&s',
  'Mackerel': 'https://cdn.prod.website-files.com/64c871291cf9e6192ef11f7a/66690d54c03c6364c72eb21b_Spanish%20Mackerel%20Species%20Guide_hero%20banner_2880x1800.jpg',
  'Greenland Halibut': 'https://natur.gl/wp-content/uploads/2019/02/hellefisk_UPN_UMM_2008_BJL_01.jpg',
  'Pacific Salmon': 'https://insideclimatenews.org/wp-content/uploads/2019/07/sockeye-salmon-900_mark-conlin-vw-pics-uig-via-getty.jpg',
  'Pollock': 'https://www.deepseaworld.com/wp-content/uploads/2020/08/pollock-scaled.jpg',
  'Herring': 'https://farm66.staticflickr.com/65535/48995918528_6f10f7475f_b.jpg',
  'Sardine': 'https://www.fisheries.noaa.gov/s3//styles/original/s3/2022-09/640x427-Sardine-Pacific-NOAAFisheries.png?itok=LoZ4D4ym',
  'Anchovy': 'https://www.cento.com/images/articles/anchovies/anchovy_stock.jpg',
  'Peruvian Anchoveta': 'https://www.worldlifeexpectancy.com/images/a/w/b/engraulis-japonicus/engraulis-japonicus.webp',
  'Horse Mackerel': 'https://a-z-animals.com/media/2022/10/Yellowfin-Horse-Mackerel.jpg',
  'Reef Fish (Various)': 'https://cdn.shopify.com/s/files/1/0024/1788/5284/files/moorish-idol.jpg',
  'Hilsa': 'https://i.dawn.com/primary/2023/08/22120827858e60e.gif',
  'European Anchovy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Anchovy_closeup.jpg/960px-Anchovy_closeup.jpg',
  'Hoki': 'https://dzpdbgwih7u1r.cloudfront.net/96a712f9-ffe1-4b13-b47a-d727d6df84f5/9c44bb5f-4f13-4695-8fde-12ee99184cf2/9c44bb5f-51a9-4e6c-980e-a8ed5ad5e864/w1200h406-b9ede379f02398c6b0f7fda3806c301e.png',
  'Jack Mackerel': 'https://caseagrant.ucsd.edu/sites/default/files/styles/800px/public/importedFiles/pacific-jack-mackeral-roberson-2.jpg?itok=0HrVZMgI',
  // Default image
  'default': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9OR-P1c307t14sfkM6z3duPzyqnFZiCD8VA&s'
     };
     return photos[speciesName] || photos['default'];
   }
// Get dummy environmental data
router.get('/dummy-data', (req, res) => {
  try {
    const data = generateDummyData();
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
      total_risks: data.features.length,
      summary: {
        deforestation: data.features.filter(f => f.properties.type === 'deforestation').length,
        mining: data.features.filter(f => f.properties.type === 'mining').length,
        forest_fire: data.features.filter(f => f.properties.type === 'forest_fire').length
      }
    });
  } catch (error) {
    console.error('Error generating dummy data:', error);
    res.status(500).json({ error: 'Failed to generate environmental data' });
  }
});

// Get risk statistics
router.get('/statistics', (req, res) => {
  try {
    const data = generateDummyData();
    const stats = {
      total_risks: data.features.length,
      by_type: {
        deforestation: data.features.filter(f => f.properties.type === 'deforestation').length,
        mining: data.features.filter(f => f.properties.type === 'mining').length,
        forest_fire: data.features.filter(f => f.properties.type === 'forest_fire').length
      },
      by_severity: {
        low: data.features.filter(f => f.properties.severity === 'Low').length,
        medium: data.features.filter(f => f.properties.severity === 'Medium').length,
        high: data.features.filter(f => f.properties.severity === 'High').length
      },
      total_area_affected: data.features.reduce((sum, f) => sum + f.properties.area, 0),
      average_confidence: Math.round(
        data.features.reduce((sum, f) => sum + f.properties.confidence, 0) / data.features.length
      )
    };

    res.json({
      success: true,
      statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating statistics:', error);
    res.status(500).json({ error: 'Failed to generate statistics' });
  }
});

// Get risk by type
router.get('/risks/:type', (req, res) => {
  try {
    const { type } = req.params;
    const data = generateDummyData();
    
    const filteredData = data.features.filter(f => f.properties.type === type);
    
    if (filteredData.length === 0) {
      return res.status(404).json({ error: 'Risk type not found' });
    }

    res.json({
      success: true,
      type: type,
      data: {
        type: 'FeatureCollection',
        features: filteredData
      },
      count: filteredData.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error filtering risks:', error);
    res.status(500).json({ error: 'Failed to filter risks' });
  }
});

// Get marine life hotspots
router.get('/marine-life', (req, res) => {
  try {
    const data = generateMarineLifeData();
    const { species } = req.query;

    let filtered = data.features;
    if (species) {
      const q = String(species).toLowerCase();
      filtered = filtered.filter(f =>
        f.properties.mainSpecies.toLowerCase().includes(q) ||
        (Array.isArray(f.properties.speciesMix) && f.properties.speciesMix.some(s => s.name.toLowerCase().includes(q)))
      );
    }

    res.json({
      success: true,
      data: { type: 'FeatureCollection', features: filtered },
      total: filtered.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating marine life data:', error);
    res.status(500).json({ error: 'Failed to generate marine life data' });
  }
});

// Marine life summary statistics
router.get('/marine-life/statistics', (req, res) => {
  try {
    const data = generateMarineLifeData();
    const speciesCount = {};
    data.features.forEach(f => {
      const main = f.properties.mainSpecies;
      speciesCount[main] = (speciesCount[main] || 0) + 1;
    });

    const topSpecies = Object.entries(speciesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const avgBiomass = Math.round(data.features.reduce((s, f) => s + (f.properties.biomassIndex || 0), 0) / data.features.length);
    const avgConfidence = Math.round(data.features.reduce((s, f) => s + (f.properties.confidence || 0), 0) / data.features.length);

    res.json({
      success: true,
      statistics: {
        total_points: data.features.length,
        topSpecies,
        average_biomass_index: avgBiomass,
        average_confidence: avgConfidence
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating marine life statistics:', error);
    res.status(500).json({ error: 'Failed to generate marine life statistics' });
  }
});

// Return a lightweight list of available location names for frontend selects
router.get('/locations', (req, res) => {
  try {
    // Locations that match the AI model's trained locations
    const locations = [
      { id: 1, name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
      { id: 2, name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
      { id: 3, name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
      { id: 4, name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298 },
      { id: 5, name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918 },
      { id: 6, name: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321 },
      { id: 7, name: 'Austin', country: 'USA', lat: 30.2672, lng: -97.7431 },
      { id: 8, name: 'Denver', country: 'USA', lat: 39.7392, lng: -104.9903 },
      { id: 9, name: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589 },
      { id: 10, name: 'Portland', country: 'USA', lat: 45.5152, lng: -122.6784 }
    ];

    res.json({ success: true, locations, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Error returning locations:', err);
    res.status(500).json({ error: 'Failed to return locations' });
  }
});

// Nowtricity API - Carbon Intensity Data
const NOWTRICITY_API_KEY = process.env.NOWTRICITY_API_KEY || '7699893e997bc822c09aa8d56e200633';
const NOWTRICITY_BASE_URL = process.env.NOWTRICITY_BASE_URL || 'https://www.nowtricity.com/api';

// Get global average carbon intensity (aggregated from multiple countries)
router.get('/carbon-intensity/:countryId?', async (req, res) => {
  try {
    const countryId = req.params.countryId || 'global';
    console.log(`🔋 Fetching carbon intensity data for ${countryId}`);
    
    if (countryId === 'global') {
      // Fetch data from multiple major countries and calculate average
      const countries = ['germany', 'france', 'spain', 'italy'];
      const promises = countries.map(country => 
        axios.get(`${NOWTRICITY_BASE_URL}/current-emissions/${country}/`, {
          headers: {
            'X-Api-Key': NOWTRICITY_API_KEY,
            'User-Agent': 'EarthSight-Environmental-Platform',
            'Accept': 'application/json'
          },
          timeout: 10000,
          validateStatus: status => status < 500
        }).catch(() => null)
      );

      const results = await Promise.all(promises);
      const validResults = results.filter(r => r && r.status === 200 && r.data);

      if (validResults.length > 0) {
        // Calculate average emissions
        const avgEmissions = Math.round(
          validResults.reduce((sum, r) => sum + (r.data.emissions?.value || 0), 0) / validResults.length
        );
        const avgRenewable = Math.round(
          validResults.reduce((sum, r) => sum + (r.data.renewable_percentage || 50), 0) / validResults.length
        );

        console.log(`✅ Global average calculated: ${avgEmissions} g CO2eq/kWh, ${avgRenewable}% renewable`);

        res.json({
          success: true,
          data: {
            country: { id: 'global', name: 'Global Average' },
            emissions: {
              value: avgEmissions,
              unit: 'g CO2eq/kWh',
              timestamp: Math.floor(Date.now() / 1000),
              dateUTC: new Date().toISOString(),
              dateLocal: new Date().toISOString(),
              outdated: false
            },
            renewable_percentage: avgRenewable,
            countries_sampled: validResults.length,
            last_updated: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('No valid country data received');
      }
    } else {
      // Fetch specific country data
      const response = await axios.get(`${NOWTRICITY_BASE_URL}/current-emissions/${countryId}/`, {
        headers: {
          'X-Api-Key': NOWTRICITY_API_KEY,
          'User-Agent': 'EarthSight-Environmental-Platform',
          'Accept': 'application/json'
        },
        timeout: 15000,
        validateStatus: status => status < 500
      });

      if (response.status === 200 && response.data) {
        console.log(`✅ Carbon intensity data retrieved: ${response.data.emissions?.value || 'N/A'} ${response.data.emissions?.unit || ''}`);
        
        // Enhance data with renewable energy estimate
        const renewableMap = {
          'usa': 22, 'germany': 45, 'france': 27, 'spain': 42, 'italy': 38,
          'norway': 98, 'sweden': 70, 'portugal': 75, 'austria': 89
        };
        
        const enhancedData = {
          ...response.data,
          renewable_percentage: renewableMap[countryId] || Math.floor(Math.random() * 30) + 30,
          last_updated: new Date().toISOString()
        };
        
        res.json({
          success: true,
          data: enhancedData,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('Invalid response from API');
      }
    }

  } catch (error) {
    console.error('❌ Error fetching carbon intensity:', error.message);
    
    // Return USA fallback data
    res.json({
      success: true,
      data: {
        country: { id: 'usa', name: 'United States' },
        emissions: {
          value: 385,
          unit: 'g CO2eq/kWh',
          timestamp: Math.floor(Date.now() / 1000),
          dateUTC: new Date().toISOString(),
          dateLocal: new Date().toISOString(),
          outdated: true
        },
        renewable_percentage: 22,
        last_updated: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      fallback: true,
      error: error.message
    });
  }
});

// Get list of available countries from Nowtricity
router.get('/carbon-countries', async (req, res) => {
  try {
    console.log('🌍 Fetching available countries from Nowtricity');
    
    const response = await axios.get(`${NOWTRICITY_BASE_URL}/countries/`, {
      headers: {
        'X-Api-Key': NOWTRICITY_API_KEY,
        'User-Agent': 'EarthSight-Environmental-Platform'
      },
      timeout: 10000
    });

    if (response.data && response.data.countries) {
      console.log(`✅ Retrieved ${response.data.countries.length} countries`);
      res.json({
        success: true,
        countries: response.data.countries,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('No countries data received');
    }

  } catch (error) {
    console.error('❌ Error fetching countries:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch countries list',
      message: error.message 
    });
  }
});

// Get 24-hour emissions history for a country
router.get('/carbon-history/:countryId?', async (req, res) => {
  try {
    const countryId = req.params.countryId || 'portugal';
    console.log(`📊 Fetching 24h carbon history for ${countryId}`);
    
    const response = await axios.get(`${NOWTRICITY_BASE_URL}/emissions-previous-24h/${countryId}/`, {
      headers: {
        'X-Api-Key': NOWTRICITY_API_KEY,
        'User-Agent': 'EarthSight-Environmental-Platform'
      },
      timeout: 10000
    });

    if (response.data) {
      console.log(`✅ Retrieved 24h history with ${response.data.emissions?.length || 0} data points`);
      res.json({
        success: true,
        data: response.data,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('No history data received');
    }

  } catch (error) {
    console.error('❌ Error fetching carbon history:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch carbon history',
      message: error.message 
    });
  }
});

module.exports = router; 