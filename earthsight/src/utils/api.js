import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const environmentApi = {
  getDummyData: () => api.get('/environment/dummy-data').then(r => r.data),
  getStatistics: () => api.get('/environment/statistics').then(r => r.data),
  getRisksByType: (type) => api.get(`/environment/risks/${type}`).then(r => r.data),
  // optional species string filters the results (query param)
  getMarineLife: (species) => api.get('/environment/marine-life', { params: species ? { species } : {} }).then(r => r.data),
  getMarineLifeStatistics: () => api.get('/environment/marine-life/statistics').then(r => r.data),
  getLocations: () => api.get('/environment/locations').then(r => r.data)
}

// Helper to include auth token from localStorage when present
function authHeaders() {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch (e) {
    return {}
  }
}

export const predictionApi = {
  predict: (payload) => api.post('/predict', payload, { headers: authHeaders() }).then(r => r.data),
  modelStatus: () => api.get('/predict/model-status', { headers: authHeaders() }).then(r => r.data),
  trainModel: (payload) => api.post('/predict/train-model', payload, { headers: authHeaders() }).then(r => r.data),
  history: () => api.get('/predict/history', { headers: authHeaders() }).then(r => r.data),
  insights: (params) => api.get('/predict/insights', { params, headers: authHeaders() }).then(r => r.data),
  testModel: () => api.post('/predict/test-model', {}, { headers: authHeaders() }).then(r => r.data),
}

export const pdfApi = {
  // PDF generation works without authentication (public access)
  generateReport: (payload) => api.post('/pdf/report', payload).then(r => r.data),
  analyze: (payload) => api.post('/pdf/analyze', payload, { headers: authHeaders() }).then(r => r.data),
  query: (payload) => api.post('/pdf/analyze/query', payload, { headers: authHeaders() }).then(r => r.data),
  download: (filename) => `${api.defaults.baseURL || ''}/pdf/download/${filename}`
}

export default api
