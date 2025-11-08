import React, { useState } from 'react'
import { useAuthModal } from '../contexts/AuthModalContext'
import { useAuth } from '../contexts/AuthContext'
import { showToast } from './FuturisticToast'

const AuthModal = () => {
  const { isOpen, mode, close, setMode } = useAuthModal()
  const { login, register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', emailNotifications: true })
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const isSignUp = mode === 'register'

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'login') {
        if (!form.email || !form.password) throw new Error('Email and password are required')
        const res = await login(form.email, form.password)
        if (!res || res.success === false) throw new Error(res?.error || 'Login failed')
        showToast('🎉 Welcome back!', 'success', 2500)
      } else {
        if (!form.name || !form.email || !form.password) throw new Error('Name, email and password are required')
        if (form.password !== form.confirmPassword) throw new Error('Passwords do not match')
        if (form.password.length < 6) throw new Error('Password must be at least 6 characters')
        const { confirmPassword, ...registerData } = form
        const res = await register(registerData)
        if (!res || res.success === false) throw new Error(res?.error || 'Registration failed')
        showToast('🎊 Account created successfully!', 'success', 2500)
      }
      
      // Close modal and wait for state to update
      close()
      
      // Small delay to ensure auth state propagates before any navigation
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (err) {
      // Prefer backend error message when available (axios)
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message
      const errorMsg = serverMsg || err.message || 'Failed'
      setError(errorMsg)
      showToast(`❌ ${errorMsg}`, 'error', 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 z-50 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-30 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <img src="/img/logo.png" alt="Earthsight" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-gray-800">earthsight</span>
        </div>

        {/* Animated Overlay Panel */}
        <div
          className={`absolute top-0 h-full w-1/2 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 transition-all duration-700 ease-in-out z-10 ${
            isSignUp ? "left-0" : "left-1/2"
          }`}
        >
          {/* Decorative geometric shapes */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-300/20 rounded-lg rotate-45" />

          <div className="relative h-full flex flex-col items-center justify-center text-white p-12">
            {isSignUp ? (
              <>
                <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
                <p className="text-center text-teal-50 mb-8 max-w-xs">
                  Enter your personal details and start your journey with us
                </p>
                <button
                  onClick={() => setMode('login')}
                  className="px-12 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-teal-500 transition-all duration-300"
                >
                  SIGN IN
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-center text-teal-50 mb-8 max-w-xs">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  onClick={() => setMode('register')}
                  className="px-12 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-teal-500 transition-all duration-300"
                >
                  SIGN UP
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center p-12 transition-all duration-700 ease-in-out ${
            isSignUp ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in to Account</h2>
            <p className="text-gray-500 mb-8">Use your email account</p>

            {error && !isSignUp && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-600 text-sm animate-shake">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>SIGNING IN...</span>
                  </div>
                ) : (
                  'SIGN IN'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sign Up Form */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center p-12 transition-all duration-700 ease-in-out ${
            isSignUp ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-500 mb-8">Use your email for registration</p>

            {error && isSignUp && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-600 text-sm animate-shake">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <label className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={form.emailNotifications}
                  onChange={onChange}
                  className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-gray-600">Receive environmental alerts via email</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>SIGNING UP...</span>
                  </div>
                ) : (
                  'SIGN UP'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
