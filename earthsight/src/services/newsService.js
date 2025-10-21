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
      params: queryParams
    })

    if (response.data && response.data.status === 'success') {
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

      return {
        success: true,
        data: transformedNews,
        total: response.data.totalResults || transformedNews.length,
        nextPage: response.data.nextPage || null
      }
    }

    return {
      success: false,
      error: 'No news data available',
      data: []
    }

  } catch (error) {
    console.error('News API Error:', error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.results?.message || error.message || 'Failed to fetch news',
      data: []
    }
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

export default {
  getEnvironmentNews,
  searchEnvironmentNews,
  getNewsByTopic
}
