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

  // Generate random coordinates around the world
  const locations = [
    { lat: 27.7172, lng: 85.324, name: 'Kathmandu, Nepal' },
    { lat: 40.7128, lng: -74.0060, name: 'New York, USA' },
    { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
    { lat: 55.7558, lng: 37.6176, name: 'Moscow, Russia' },
    { lat: -23.5505, lng: -46.6333, name: 'São Paulo, Brazil' },
    { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
    { lat: 39.9042, lng: 116.4074, name: 'Beijing, China' },
    { lat: -26.2041, lng: 28.0473, name: 'Johannesburg, South Africa' }
  ];

  locations.forEach((location, index) => {
    const risk = risks[index % risks.length];
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

module.exports = router; 