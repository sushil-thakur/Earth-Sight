import axios from 'axios'

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY
const NEWS_API_URL = import.meta.env.VITE_NEWS_API_URL || 'https://newsdata.io/api/1'

/**
 * Fetch environment-related news from NewsData.io API
 * @param {Object} params - Query parameters
 * @param {string} params.category - News category (default: 'environment')
 * @param {string} params.language - Language code (default: 'en')
 * @param {number} params.size - Number of articles to fetch (default: 10, max: 50)
 * @returns {Promise<Object>} - News data
 */
export const getEnvironmentNews = async (params = {}) => {
  try {
    // Check if API key is configured
    if (!NEWS_API_KEY || NEWS_API_KEY === 'your_newsdata_api_key_here') {
      console.warn('⚠️ News API key not configured. Using mock data.')
      return getMockNews()
    }

    const {
      language = 'en',
      country = null
    } = params

    // Use keyword search instead of category for free tier
    const queryParams = {
      apikey: NEWS_API_KEY,
      q: 'environment OR climate OR conservation OR deforestation OR pollution OR wildlife',
      language: language
    }

    // Add country if specified
    if (country) {
      queryParams.country = country
    }

    const response = await axios.get(`${NEWS_API_URL}/news`, {
      params: queryParams,
      timeout: 10000 // 10 second timeout
    })

    if (response.data && response.data.status === 'success' && response.data.results?.length > 0) {
      // Transform the data to match our app's format
      const transformedNews = response.data.results.map((article, index) => ({
        id: article.article_id || `news-${index}`,
        title: article.title || 'Untitled',
        description: article.description || article.content || 'No description available',
        date: formatDate(article.pubDate),
        category: getCategoryLabel(article.category?.[0] || 'environment'),
        image: article.image_url || article.video_url || getDefaultImage(article.category?.[0]),
        source: article.source_id || 'Unknown',
        link: article.link,
        keywords: article.keywords || [],
        country: article.country?.[0] || 'Unknown'
      }))

      console.log(`✅ Loaded ${transformedNews.length} news articles from API`)
      return {
        success: true,
        data: transformedNews,
        total: response.data.totalResults || transformedNews.length,
        nextPage: response.data.nextPage || null
      }
    }

    // If API returns no results, use mock data
    console.warn('⚠️ News API returned no results. Using mock data.')
    return getMockNews()

  } catch (error) {
    console.error('❌ News API Error:', error.response?.data || error.message)
    console.warn('⚠️ Using mock news data as fallback.')
    return getMockNews()
  }
}

/**
 * Search environment news by keywords
 * @param {string} query - Search query
 * @param {number} size - Number of results
 * @returns {Promise<Object>} - Search results
 */
export const searchEnvironmentNews = async (query) => {
  try {
    const response = await axios.get(`${NEWS_API_URL}/news`, {
      params: {
        apikey: NEWS_API_KEY,
        q: query,
        language: 'en'
      }
    })

    if (response.data && response.data.status === 'success') {
      const transformedNews = response.data.results.map((article, index) => ({
        id: article.article_id || `search-${index}`,
        title: article.title || 'Untitled',
        description: article.description || article.content || 'No description available',
        date: formatDate(article.pubDate),
        category: getCategoryLabel(article.category?.[0] || 'environment'),
        image: article.image_url || article.video_url || getDefaultImage(article.category?.[0]),
        source: article.source_id || 'Unknown',
        link: article.link,
        keywords: article.keywords || []
      }))

      return {
        success: true,
        data: transformedNews,
        total: response.data.totalResults || transformedNews.length
      }
    }

    return {
      success: false,
      error: 'No results found',
      data: []
    }

  } catch (error) {
    console.error('News Search Error:', error.response?.data || error.message)
    return {
      success: false,
      error: error.message || 'Failed to search news',
      data: []
    }
  }
}

/**
 * Get news by specific environmental topics
 * @param {string} topic - Topic (deforestation, climate, ocean, wildlife, etc.)
 * @param {number} size - Number of articles
 * @returns {Promise<Object>} - News data
 */
export const getNewsByTopic = async (topic) => {
  const topicKeywords = {
    deforestation: 'deforestation OR rainforest OR forest loss',
    climate: 'climate change OR global warming OR carbon emissions',
    ocean: 'ocean pollution OR marine life OR coral reef',
    wildlife: 'endangered species OR wildlife conservation OR biodiversity',
    energy: 'renewable energy OR solar power OR wind energy',
    pollution: 'air pollution OR water pollution OR plastic waste'
  }

  const query = topicKeywords[topic.toLowerCase()] || topic

  return searchEnvironmentNews(query)
}

/**
 * Format date to relative time
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Recently'
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
    } else if (diffDays < 7) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  } catch (error) {
    return 'Recently'
  }
}

/**
 * Get category label
 * @param {string} category - Category code
 * @returns {string} - Readable category label
 */
const getCategoryLabel = (category) => {
  const labels = {
    environment: 'Environment',
    science: 'Science',
    technology: 'Technology',
    world: 'World News',
    top: 'Top Story',
    business: 'Business',
    politics: 'Politics'
  }
  
  return labels[category.toLowerCase()] || 'Environment'
}

/**
 * Get default placeholder image based on category
 * @param {string} category - News category
 * @returns {string} - Image URL
 */
const getDefaultImage = (category) => {
  const images = {
    environment: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
    science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
    technology: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
    default: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop'
  }
  
  return images[category?.toLowerCase()] || images.default
}

/**
 * Get mock news data as fallback when API is unavailable
 * @returns {Object} - Mock news response
 */
const getMockNews = () => {
  const mockArticles = [
    {
      id: 'mock-1',
      title: 'Global Climate Summit Announces Ambitious Carbon Reduction Targets for 2030',
      description: 'World leaders commit to new carbon emission goals with focus on renewable energy transition and sustainable development across all sectors.',
      date: '2 hours ago',
      category: 'Environment',
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop',
      source: 'Environmental News',
      link: 'https://example.com/news/1',
      keywords: ['climate', 'carbon', 'renewable energy'],
      country: 'Global'
    },
    {
      id: 'mock-2',
      title: 'Amazon Rainforest Conservation Efforts Show Positive Results',
      description: 'New satellite imagery reveals forest regeneration in protected areas, attributed to community-led conservation programs and stricter enforcement.',
      date: '5 hours ago',
      category: 'Environment',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
      source: 'Nature Today',
      link: 'https://example.com/news/2',
      keywords: ['deforestation', 'amazon', 'conservation'],
      country: 'Brazil'
    },
    {
      id: 'mock-3',
      title: 'Ocean Cleanup Initiative Removes 100 Tons of Plastic from Pacific',
      description: 'Breakthrough technology successfully extracts record amount of plastic waste from ocean, marking major milestone in marine conservation efforts.',
      date: '1 day ago',
      category: 'Environment',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      source: 'Ocean Conservation',
      link: 'https://example.com/news/3',
      keywords: ['ocean', 'pollution', 'cleanup'],
      country: 'Global'
    },
    {
      id: 'mock-4',
      title: 'Renewable Energy Surpasses Fossil Fuels in Global Production',
      description: 'Solar and wind power generation reaches historic milestone, overtaking coal and natural gas in worldwide energy production for the first time.',
      date: '2 days ago',
      category: 'Science',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      source: 'Energy News',
      link: 'https://example.com/news/4',
      keywords: ['renewable', 'solar', 'wind'],
      country: 'Global'
    },
    {
      id: 'mock-5',
      title: 'Endangered Species Populations Rebound in Protected Habitats',
      description: 'Wildlife populations show significant recovery in newly established conservation zones, demonstrating effectiveness of protection policies.',
      date: '3 days ago',
      category: 'Environment',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
      source: 'Wildlife Foundation',
      link: 'https://example.com/news/5',
      keywords: ['wildlife', 'conservation', 'endangered species'],
      country: 'Global'
    },
    {
      id: 'mock-6',
      title: 'Urban Green Spaces Reduce City Heat by 5°C Study Finds',
      description: 'Research shows urban vegetation significantly lowers heat island effect, improving air quality and public health in major cities worldwide.',
      date: '4 days ago',
      category: 'Environment',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      source: 'Urban Ecology',
      link: 'https://example.com/news/6',
      keywords: ['urban', 'green spaces', 'climate'],
      country: 'Global'
    }
  ]

  return {
    success: true,
    data: mockArticles,
    total: mockArticles.length,
    nextPage: null,
    isMockData: true
  }
}

export default {
  getEnvironmentNews,
  searchEnvironmentNews,
  getNewsByTopic
}
