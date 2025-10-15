import { useState, useEffect } from "react"
import { ArrowRightLeft, TrendingUp, DollarSign, Loader2 } from "lucide-react"

const API_KEY = "5beb978b21bacefd4e894873"
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`

// Popular currencies for quick selection
const popularCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "Rs" },
]

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("NPR")
  const [exchangeRate, setExchangeRate] = useState(null)
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [allCurrencies, setAllCurrencies] = useState({})

  // Fetch exchange rates
  const fetchExchangeRate = async (baseCurrency) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/${baseCurrency}`)
      const data = await response.json()
      
      if (data.result === "success") {
        setAllCurrencies(data.conversion_rates)
        setExchangeRate(data.conversion_rates[toCurrency])
        setLastUpdated(new Date(data.time_last_update_unix * 1000).toLocaleString())
        
        // Calculate converted amount
        const result = parseFloat(amount) * data.conversion_rates[toCurrency]
        setConvertedAmount(result.toFixed(2))
      } else {
        setError("Failed to fetch exchange rates")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRate(fromCurrency)
    }
  }, [fromCurrency])

  // Recalculate when amount or target currency changes
  useEffect(() => {
    if (exchangeRate && amount && allCurrencies[toCurrency]) {
      const result = parseFloat(amount || 0) * allCurrencies[toCurrency]
      setConvertedAmount(result.toFixed(2))
    }
  }, [amount, toCurrency, allCurrencies])

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/20">
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Currency Converter
          </h3>
        </div>

        <div className="space-y-6">
          {/* From Currency Section */}
          <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
            <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">From</label>
            <div className="space-y-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-3xl font-bold text-white placeholder:text-slate-600"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-white font-semibold cursor-pointer"
              >
                {popularCurrencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-3">
            <button
              onClick={swapCurrencies}
              className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all hover:scale-110 hover:rotate-180 shadow-lg shadow-emerald-500/30 z-10"
            >
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* To Currency Section */}
          <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
            <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">To</label>
            <div className="space-y-3">
              <div className="w-full px-4 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-3xl font-bold text-emerald-400 min-h-[60px] flex items-center">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xl">Loading...</span>
                  </div>
                ) : (
                  <span>{convertedAmount || "0.00"}</span>
                )}
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-white font-semibold cursor-pointer"
              >
                {popularCurrencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exchange Rate Info */}
          {exchangeRate && !loading && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Exchange Rate</span>
              </div>
              <p className="text-white font-bold text-lg">
                1 {fromCurrency} = {allCurrencies[toCurrency]?.toFixed(4)} {toCurrency}
              </p>
              {lastUpdated && (
                <p className="text-xs text-slate-400 mt-2">Last updated: {lastUpdated}</p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Quick Conversion Examples */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center">
              <p className="text-xs text-slate-400 mb-1">10 {fromCurrency}</p>
              <p className="text-lg font-bold text-white">
                {allCurrencies[toCurrency] ? (10 * allCurrencies[toCurrency]).toFixed(2) : "0.00"} {toCurrency}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center">
              <p className="text-xs text-slate-400 mb-1">100 {fromCurrency}</p>
              <p className="text-lg font-bold text-white">
                {allCurrencies[toCurrency] ? (100 * allCurrencies[toCurrency]).toFixed(2) : "0.00"} {toCurrency}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center font-medium">
            Real-time exchange rates powered by ExchangeRate-API
          </p>
        </div>
      </div>
    </div>
  )
}

// Export as both names for compatibility
export { CurrencyConverter as PriceGuessingGame }