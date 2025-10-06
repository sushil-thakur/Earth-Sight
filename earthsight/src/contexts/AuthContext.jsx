import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

// ensure axios base points to backend
axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/profile')
        .then(res => {
          setUser(res.data.user)
        })
        .catch(() => {
          delete axios.defaults.headers.common['Authorization']
          localStorage.removeItem('token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      if (res.data?.token) {
        const token = res.data.token
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(res.data.user)
      }
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Login error', err.response?.data || err.message)
      return { success: false, error: err.response?.data?.error || err.message }
    }
  }

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData)
      if (res.data?.token) {
        const token = res.data.token
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(res.data.user)
      }
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Register error', err.response?.data || err.message)
      return { success: false, error: err.response?.data?.error || err.message }
    }
  }

  const logout = () => {
    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateProfile = async (updates) => {
    const res = await axios.put('/api/auth/profile', updates)
    if (res.data?.user) setUser(res.data.user)
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
