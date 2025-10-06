import React, { createContext, useContext, useState } from 'react'

const AuthModalContext = createContext()

export const useAuthModal = () => useContext(AuthModalContext)

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState('login') // 'login' or 'register'

  const open = (m = 'login') => {
    setMode(m)
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, open, close, setMode }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export default AuthModalContext
