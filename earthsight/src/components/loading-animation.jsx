import { Brain } from "lucide-react"

export function LoadingAnimation({ isLoading }) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/98 backdrop-blur-3xl">
      <div className="text-center space-y-10">
        <div className="relative">
          {/* Outer rotating ring with RGB effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full animate-spin-slow">
              <div className="w-full h-full rounded-full border-4 border-transparent animate-rgb-border"></div>
            </div>
          </div>

          {/* Middle pulsing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-indigo-500/20 animate-pulse-slow"></div>
          </div>

          {/* Inner spinning ring */}
          <div className="absolute inset-0 flex items-center justify-center animate-spin">
            <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-indigo-500 border-r-cyan-500"></div>
          </div>

          {/* Center icon */}
          <div className="relative flex items-center justify-center h-48">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-2xl shadow-indigo-500/50 animate-pulse">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent animate-pulse">
            AI Processing
          </h3>
          <p className="text-lg text-indigo-300 font-medium">Analyzing neural networks and predictive algorithms</p>
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 animate-bounce shadow-lg shadow-indigo-500/50"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}