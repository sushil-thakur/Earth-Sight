import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export function FuturisticToast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10)

    // Auto close
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, 300)
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          gradient: 'from-emerald-500 via-green-500 to-teal-500',
          glow: 'shadow-emerald-500/50',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400'
        }
      case 'error':
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          gradient: 'from-red-500 via-rose-500 to-pink-500',
          glow: 'shadow-red-500/50',
          border: 'border-red-500/30',
          text: 'text-red-400'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          gradient: 'from-amber-500 via-orange-500 to-yellow-500',
          glow: 'shadow-amber-500/50',
          border: 'border-amber-500/30',
          text: 'text-amber-400'
        }
      default:
        return {
          icon: <Info className="w-6 h-6" />,
          gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
          glow: 'shadow-cyan-500/50',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      className={`transition-all duration-300 transform ${
        isVisible && !isLeaving 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-90'
      }`}
    >
      {/* Subtle background glow */}
      <div className={`absolute -inset-[1px] bg-gradient-to-r ${styles.gradient} rounded-xl blur-sm opacity-30`}></div>
      
      {/* Main toast container */}
      <div className={`relative backdrop-blur-md bg-slate-900/90 border ${styles.border} rounded-xl p-4 pr-12 min-w-[320px] max-w-md shadow-xl`}>
        {/* Content */}
        <div className="relative flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${styles.text}`}>
            {styles.icon}
          </div>

          {/* Message */}
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-white leading-relaxed">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <X className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50 rounded-b-xl overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${styles.gradient}`}
            style={{
              animation: `toast-progress ${duration}ms linear`
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}

// Toast Container Component
export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event) => {
      const { message, type, duration } = event.detail
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type, duration }])
    }

    window.addEventListener('show-toast', handleToast)
    return () => window.removeEventListener('show-toast', handleToast)
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <div className="fixed top-0 right-0 z-[9999] pointer-events-none">
      <div className="flex flex-col gap-3 p-6 pointer-events-auto">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              transform: `translateY(${index * 10}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <FuturisticToast
              message={toast.message}
              type={toast.type}
              duration={toast.duration || 3000}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to show toasts
export const showToast = (message, type = 'info', duration = 3000) => {
  const event = new CustomEvent('show-toast', {
    detail: { message, type, duration }
  })
  window.dispatchEvent(event)
}
