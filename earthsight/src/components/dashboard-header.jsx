import { Brain, LogOut, User, Clock } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react"
import { showToast } from './FuturisticToast'

export function DashboardHeader() {
  const { user, logout, isAuthenticated } = useAuth()
  const [timeLeft, setTimeLeft] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    const updateTimeLeft = () => {
      const loginTime = localStorage.getItem('loginTime')
      if (!loginTime) return

      const now = new Date().getTime()
      const elapsed = now - parseInt(loginTime)
      const tenMinutes = 10 * 60 * 1000
      const remaining = tenMinutes - elapsed

      if (remaining <= 0) {
        setTimeLeft('Expired')
      } else {
        const minutes = Math.floor(remaining / 60000)
        const seconds = Math.floor((remaining % 60000) / 1000)
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    setShowLogoutModal(false)
    logout()
    showToast('👋 Logged out successfully!', 'success', 2500)
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
    showToast('❌ Logout cancelled', 'info', 2000)
  }

  return (
    <header className="relative backdrop-blur-2xl bg-slate-950/80">
      <div className="absolute inset-x-0 bottom-0 h-[2px] animate-rgb-line"></div>
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-2xl shadow-indigo-500/50">
              <div className="absolute inset-0 rounded-2xl animate-rgb-border-slow opacity-50"></div>
              <Brain className="w-8 h-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                EarthSight
              </h1>
              <p className="text-sm text-indigo-300 font-medium">AI-Powered Real Estate Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-sm text-emerald-400 font-bold">AI ACTIVE</span>
            </div>

            {isAuthenticated && (
              <>
                {/* Session Timer */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-mono font-bold">{timeLeft}</span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-indigo-400 font-medium">{user?.name || user?.email}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                  <span className="text-sm text-red-400 font-medium group-hover:text-red-300">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Futuristic Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-violet-500/30 animate-scaleIn overflow-hidden">
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 opacity-50 blur-xl animate-pulse" />
            
            {/* Content */}
            <div className="relative p-8">
              {/* Icon with animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/50 animate-bounce">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/20 animate-pulse" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent animate-shimmer">
                Confirm Logout
              </h2>

              {/* Message */}
              <p className="text-slate-300 text-center mb-8 text-lg">
                Are you sure you want to logout?
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                {/* Cancel Button */}
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-6 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-600/50 hover:border-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/30 active:scale-95"
                >
                  Cancel
                </button>

                {/* Confirm Button */}
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
                >
                  <span className="relative z-10">OK</span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      )}
    </header>
  )
}