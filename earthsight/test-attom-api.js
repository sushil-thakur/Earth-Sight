/**
 * Test script to validate ATTOM API key
 * Run with: node test-attom-api.js <YOUR_API_KEY>
 * Or set ATTOM_KEY environment variable
 */

import axios from 'axios'

const ATTOM_API_KEY = process.argv[2] || process.env.ATTOM_KEY || '46342ba47d0dc263b8e89c5a43fceeeb'
const ATTOM_BASE_URL = 'https://api.gateway.attomdata.com/propertyapi/v1.0.0'

console.log = (...args) => {
  process.stdout.write(args.join(' ') + '\n')
}
console.error = (...args) => {
  process.stderr.write(args.join(' ') + '\n')
}

console.log('==========================================')
console.log('ATTOM API Key Validation Test')
console.log('==========================================')
console.log('API Key:', ATTOM_API_KEY ? `${ATTOM_API_KEY.substring(0, 8)}...` : 'NOT FOUND')
console.log('Base URL:', ATTOM_BASE_URL)
console.log('==========================================\n')

async function testATTOMAPI() {
  if (!ATTOM_API_KEY || ATTOM_API_KEY === 'your_attom_api_key_here') {
    console.error('❌ ERROR: API key not configured')
    console.log('Please set VITE_ATTOM_API_KEY in .env or .env.local')
    return
  }

  const testLocations = [
    {
      name: 'Denver, CO',
      latitude: 39.7392,
      longitude: -104.9903,
      radius: 1
    },
    {
      name: 'Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437,
      radius: 1
    },
    {
      name: 'Postal Code Test',
      postalcode: '80202'
    }
  ]

  for (const location of testLocations) {
    console.log(`\n🔍 Testing ${location.name}...`)
    
    try {
      const params = location.postalcode 
        ? { postalcode: location.postalcode }
        : { latitude: location.latitude, longitude: location.longitude, radius: location.radius }

      const response = await axios.get(`${ATTOM_BASE_URL}/property/snapshot`, {
        params,
        headers: {
          'apikey': ATTOM_API_KEY,
          'Accept': 'application/json'
        },
        timeout: 30000
      })

      if (response.data && response.data.property) {
        console.log('✅ SUCCESS!')
        console.log(`   Properties found: ${response.data.property.length}`)
        console.log(`   Status: ${response.data.status?.code} - ${response.data.status?.msg}`)
        
        if (response.data.property.length > 0) {
          const firstProp = response.data.property[0]
          console.log(`   Sample property: ${firstProp.address?.line1}, ${firstProp.address?.locality}`)
        }
      } else {
        console.log('⚠️  Response received but no properties found')
        console.log('   Response:', JSON.stringify(response.data, null, 2))
      }
    } catch (error) {
      console.log('❌ FAILED')
      
      if (error.response) {
        console.log(`   Status: ${error.response.status} ${error.response.statusText}`)
        console.log(`   Error: ${error.response.data?.status?.msg || JSON.stringify(error.response.data)}`)
        
        if (error.response.status === 401) {
          console.log('   ⚠️  This means your API key is INVALID or EXPIRED')
        } else if (error.response.status === 403) {
          console.log('   ⚠️  This means your API key does not have permission')
        } else if (error.response.status === 429) {
          console.log('   ⚠️  Rate limit exceeded - too many requests')
        }
      } else if (error.request) {
        console.log('   Error: No response received from server')
        console.log('   Check your internet connection')
      } else {
        console.log('   Error:', error.message)
      }
    }
  }

  console.log('\n==========================================')
  console.log('Test Complete')
  console.log('==========================================')
}

testATTOMAPI()
