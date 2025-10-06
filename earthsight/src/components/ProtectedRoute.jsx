import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useAuthModal } from '../contexts/AuthModalContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const { open } = useAuthModal()

  if (loading) return null

  if (!isAuthenticated) {
    open('login')
    return null
  }

  return children
}

export default ProtectedRoute
