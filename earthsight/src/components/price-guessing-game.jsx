import { Sparkles, MapPin, Home, Building2, BarChart3 } from "lucide-react"

export function PriceGuessingGame({
  gameScore,
  gameRound,
  currentProperty,
  userGuess,
  gameResult,
  showGameResult,
  onGuessChange,
  onSubmitGuess,
  onStartNewRound,
}) {
  if (!currentProperty) return null

  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/20">
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              Price Guessing Game
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
              <span className="text-xs text-indigo-300 font-semibold">Round: </span>
              <span className="text-lg font-bold text-indigo-400">{gameRound}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <span className="text-xs text-emerald-300 font-semibold">Score: </span>
              <span className="text-lg font-bold text-emerald-400">{gameScore}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Property Card */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/30">
            <div className="relative h-48 overflow-hidden">
              <img
                src={currentProperty.image || "/placeholder.svg"}
                alt={currentProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-xl font-bold text-white mb-2">{currentProperty.title}</h4>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <span>{currentProperty.location}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                  <Home className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 mb-1">Bedrooms</p>
                  <p className="text-lg font-bold text-white">{currentProperty.beds}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                  <Building2 className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 mb-1">Bathrooms</p>
                  <p className="text-lg font-bold text-white">{currentProperty.baths}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                  <BarChart3 className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 mb-1">Area</p>
                  <p className="text-lg font-bold text-white">{currentProperty.area} sq ft</p>
                </div>
              </div>

              {!showGameResult ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">
                      Guess the price (in Crores)
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 1.5"
                        value={userGuess}
                        onChange={(e) => onGuessChange(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-pink-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                      />
                      <button
                        onClick={onSubmitGuess}
                        disabled={!userGuess}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 font-bold transition-all hover:scale-105 shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 border border-pink-500/30">
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-pink-400 mb-2">+{gameResult?.points} Points!</p>
                      <p className="text-lg text-white font-semibold">{gameResult?.message}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg bg-slate-800/50">
                        <p className="text-xs text-slate-400 mb-1">Your Guess</p>
                        <p className="text-lg font-bold text-white">
                          ${Number.parseFloat(userGuess).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-slate-800/50">
                        <p className="text-xs text-slate-400 mb-1">Actual Price</p>
                        <p className="text-lg font-bold text-emerald-400">
                          ${currentProperty.actualPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-center text-sm text-slate-300">
                      You were <span className="font-bold text-pink-400">{gameResult?.percentageOff}%</span> off
                    </p>
                  </div>
                  <button
                    onClick={onStartNewRound}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-500/30"
                  >
                    Next Property
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center font-medium">
            Test your property valuation skills and learn market prices!
          </p>
        </div>
      </div>
    </div>
  )
}