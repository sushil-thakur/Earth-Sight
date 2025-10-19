/**
 * ATTOM API Test Script
 * 
 * This script tests all ATTOM API endpoints to verify they're working correctly.
 * Run this in your browser console or as a Node.js script.
 */

import {
  getPropertySnapshot,
  getPropertyDetail,
  getAreaData,
  getCommunityData,
  getComprehensiveMarketAnalysis
} from './attomDataService'

/**
 * Test Property Snapshot API
 */
async function testPropertySnapshot() {
  console.log('\n🧪 Testing Property Snapshot API...')
  
  // Test by postal code
  console.log('  Testing by postal code (82009)...')
  const result1 = await getPropertySnapshot({ postalcode: '82009' })
  console.log('  ✓ Result:', result1.success ? `Found ${result1.total} properties` : `Error: ${result1.error}`)
  
  // Test by coordinates
  console.log('  Testing by coordinates (Denver area)...')
  const result2 = await getPropertySnapshot({ 
    latitude: 39.7047, 
    longitude: -105.0814, 
    radius: 2 
  })
  console.log('  ✓ Result:', result2.success ? `Found ${result2.total} properties` : `Error: ${result2.error}`)
  
  return result1.success || result2.success
}

/**
 * Test Property Detail API
 */
async function testPropertyDetail() {
  console.log('\n🧪 Testing Property Detail API...')
  
  // First get a property to get a valid ID
  const snapshot = await getPropertySnapshot({ postalcode: '82009' })
  
  if (snapshot.success && snapshot.properties.length > 0) {
    const propertyId = snapshot.properties[0].identifier?.attomId
    
    if (propertyId) {
      console.log(`  Testing with property ID: ${propertyId}...`)
      const result = await getPropertyDetail(propertyId)
      console.log('  ✓ Result:', result.success ? 'Property details retrieved' : `Error: ${result.error}`)
      
      if (result.success) {
        console.log('  ✓ Address:', result.property.address?.full)
        console.log('  ✓ Bedrooms:', result.property.characteristics?.bedrooms)
        console.log('  ✓ Price:', result.property.sale?.lastSalePrice)
      }
      
      return result.success
    }
  }
  
  console.log('  ⚠️ Could not get valid property ID for testing')
  return false
}

/**
 * Test Area Full API
 */
async function testAreaData() {
  console.log('\n🧪 Testing Area Full API...')
  
  console.log('  Testing with postal code (82009)...')
  const result = await getAreaData({ postalcode: '82009' })
  console.log('  ✓ Result:', result.success ? 'Area data retrieved' : `Error: ${result.error}`)
  
  if (result.success && result.data) {
    console.log('  ✓ Median Home Value:', result.data.vintage?.medianvalue)
    console.log('  ✓ Price per SqFt:', result.data.vintage?.medianvaluepersqft)
  }
  
  return result.success
}

/**
 * Test Community Data API
 */
async function testCommunityData() {
  console.log('\n🧪 Testing Community Data API...')
  
  console.log('  Testing with postal code (82009)...')
  const result = await getCommunityData({ postalcode: '82009' })
  console.log('  ✓ Result:', result.success ? 'Community data retrieved' : `Error: ${result.error}`)
  
  if (result.success && result.data) {
    console.log('  ✓ Has Demographics:', !!result.data.demographics)
    console.log('  ✓ Has Economics:', !!result.data.economics)
    console.log('  ✓ Has Education:', !!result.data.education)
  }
  
  return result.success
}

/**
 * Test Comprehensive Market Analysis
 */
async function testComprehensiveAnalysis() {
  console.log('\n🧪 Testing Comprehensive Market Analysis...')
  
  console.log('  Testing with postal code (82009)...')
  const result = await getComprehensiveMarketAnalysis({ postalcode: '82009' })
  console.log('  ✓ Result:', result.success ? 'Analysis complete' : `Error: ${result.error}`)
  
  if (result.success) {
    console.log('\n  📊 Market Summary:')
    console.log('    • Total Properties:', result.summary.totalProperties)
    console.log('    • Average Price:', `$${result.summary.averagePrice.toLocaleString()}`)
    console.log('    • Median Price:', `$${result.summary.medianPrice.toLocaleString()}`)
    console.log('    • Price per SqFt:', `$${result.summary.pricePerSqFt}`)
    console.log('    • Investment Score:', `${result.summary.investmentScore}/100`)
    console.log('    • Market Trend:', result.summary.trend)
    console.log('    • Price Change:', result.summary.priceChange)
    console.log('    • Property Count:', result.metadata.propertyCount)
    
    if (result.summary.recentListings.length > 0) {
      console.log('\n  🏠 Sample Listing:')
      const listing = result.summary.recentListings[0]
      console.log('    •', listing.type)
      console.log('    •', listing.price)
      console.log('    •', listing.area)
      console.log('    •', listing.address)
    }
  }
  
  return result.success
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 ATTOM API Test Suite')
  console.log('='.repeat(60))
  
  const startTime = Date.now()
  const results = {
    propertySnapshot: false,
    propertyDetail: false,
    areaData: false,
    communityData: false,
    comprehensiveAnalysis: false
  }
  
  try {
    results.propertySnapshot = await testPropertySnapshot()
    results.propertyDetail = await testPropertyDetail()
    results.areaData = await testAreaData()
    results.communityData = await testCommunityData()
    results.comprehensiveAnalysis = await testComprehensiveAnalysis()
  } catch (error) {
    console.error('\n❌ Test suite error:', error)
  }
  
  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)
  
  console.log('\n' + '='.repeat(60))
  console.log('📋 Test Results Summary')
  console.log('='.repeat(60))
  console.log('Property Snapshot API:      ', results.propertySnapshot ? '✅ PASS' : '❌ FAIL')
  console.log('Property Detail API:        ', results.propertyDetail ? '✅ PASS' : '❌ FAIL')
  console.log('Area Data API:              ', results.areaData ? '✅ PASS' : '❌ FAIL')
  console.log('Community Data API:         ', results.communityData ? '✅ PASS' : '❌ FAIL')
  console.log('Comprehensive Analysis:     ', results.comprehensiveAnalysis ? '✅ PASS' : '❌ FAIL')
  console.log('='.repeat(60))
  
  const passed = Object.values(results).filter(r => r).length
  const total = Object.keys(results).length
  
  console.log(`\n${passed}/${total} tests passed in ${duration}s`)
  
  if (passed === total) {
    console.log('✅ All tests passed! ATTOM API integration is working correctly.')
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.')
  }
  
  console.log('\n' + '='.repeat(60))
  
  return results
}

/**
 * Quick test function - tests just the comprehensive analysis
 */
export async function quickTest(postalcode = '82009') {
  console.log(`\n🚀 Quick Test: Fetching data for ZIP code ${postalcode}...\n`)
  
  const result = await getComprehensiveMarketAnalysis({ postalcode })
  
  if (result.success) {
    console.log('✅ Success! Here\'s what we found:\n')
    console.log(`📍 Location: ${result.summary.locationInfo?.city}, ${result.summary.locationInfo?.state}`)
    console.log(`🏠 Properties: ${result.summary.totalProperties}`)
    console.log(`💰 Average Price: $${result.summary.averagePrice.toLocaleString()}`)
    console.log(`📊 Median Price: $${result.summary.medianPrice.toLocaleString()}`)
    console.log(`📈 Investment Score: ${result.summary.investmentScore}/100`)
    console.log(`🎯 Market Trend: ${result.summary.trend} (${result.summary.priceChange})`)
    console.log('\n✅ ATTOM API is working correctly!')
  } else {
    console.log('❌ Error:', result.error)
  }
  
  return result
}

// Export for use in components
export default {
  runAllTests,
  quickTest,
  testPropertySnapshot,
  testPropertyDetail,
  testAreaData,
  testCommunityData,
  testComprehensiveAnalysis
}

// Usage examples:
//
// Run all tests:
// import { runAllTests } from './testAttomApi'
// await runAllTests()
//
// Quick test:
// import { quickTest } from './testAttomApi'
// await quickTest('82009')
//
// Individual test:
// import { testPropertySnapshot } from './testAttomApi'
// await testPropertySnapshot()
