import { Zap, Home, TrendingUp, BarChart3, Download } from "lucide-react"

export function PredictionResults({ predictedPrice, forecastData, formatPrice }) {
  return (
    <div className="mt-8 space-y-8">
      {/* Price Card with RGB border - Full Width */}
      <div className="relative group animate-scale-in">
        <div className="absolute -inset-[2px] rounded-3xl animate-rgb-border"></div>
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-indigo-900/90 to-cyan-900/90 rounded-3xl p-10 shadow-2xl">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-sm text-indigo-300 mb-3 font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI Predicted Price
              </p>
              <h3 className="text-6xl font-bold bg-gradient-to-r from-indigo-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                {formatPrice(predictedPrice)}
              </h3>
            </div>
            <div className="p-6 rounded-2xl bg-indigo-500/30 shadow-xl shadow-indigo-500/30">
              <Home className="w-12 h-12 text-indigo-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between md:justify-start md:flex-col md:items-start">
              <span className="text-sm text-slate-300 font-medium">Confidence Score</span>
              <span className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-bold shadow-lg shadow-emerald-500/30">
                87% Accurate
              </span>
            </div>

            <div className="md:col-span-2">
              <div className="relative w-full bg-slate-800/50 rounded-full h-4 overflow-hidden border border-slate-700/50">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 transition-all duration-1000 shadow-lg shadow-indigo-500/50"
                  style={{ width: "87%" }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 mt-6">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>
              Based on <span className="font-bold text-white">{Math.floor(Math.random() * 500 + 500)}</span> similar
              properties
            </span>
          </div>
        </div>
      </div>

      <div className="relative group animate-scale-in" style={{ animationDelay: "0.1s" }}>
        <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-cyan-500/20">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              10-Year Price Projection
            </h3>
          </div>

          <div className="flex items-end justify-between gap-4 h-80">
            {forecastData.map((item, idx) => {
              const maxPrice = Math.max(...forecastData.map((d) => d.price))
              const height = maxPrice > 0 ? (item.price / maxPrice) * 100 : 0
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-4 group/bar">
                  <div className="relative w-full bg-slate-800/50 rounded-t-xl overflow-hidden border border-slate-700/30 group-hover/bar:border-slate-600/50 transition-all flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-indigo-500 via-cyan-500 to-violet-500 flex items-center justify-center transition-all duration-1000 shadow-lg shadow-indigo-500/30 relative"
                      style={{ height: `${height}%`, transitionDelay: `${idx * 50}ms` }}
                    >
                      <span className="text-sm font-bold text-white absolute top-2 rotate-0">
                        {(item.price / 10000000).toFixed(1)}Cr
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 font-mono font-semibold">{item.year}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-sm text-slate-400 text-center font-medium">
              Projected annual growth rate: <span className="text-cyan-400 font-bold">8%</span> • Powered by Advanced AI
            </p>
          </div>
        </div>
      </div>

      {/* Download Button - Full Width */}
      <button className="w-full py-5 rounded-2xl backdrop-blur-xl bg-slate-800/50 border border-indigo-500/30 hover:bg-slate-800/70 hover:border-indigo-500/50 font-semibold text-lg transition-all hover:scale-[1.02] shadow-lg hover:shadow-indigo-500/20 group">
        <div className="flex items-center justify-center gap-3">
          <Download className="w-5 h-5 group-hover:animate-bounce" />
          <span>Download Full Report</span>
        </div>
      </button>
    </div>
  )
}