import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const environmentApi = {
  getDummyData: () => api.get('/environment/dummy-data').then(r => r.data),
  getStatistics: () => api.get('/environment/statistics').then(r => r.data),
  getRisksByType: (type) => api.get(`/environment/risks/${type}`).then(r => r.data),
  // optional species string filters the results (query param)
  getMarineLife: (species) => api.get('/environment/marine-life', { params: species ? { species } : {} }).then(r => r.data),
  getMarineLifeStatistics: () => api.get('/environment/marine-life/statistics').then(r => r.data),
}

export default api
