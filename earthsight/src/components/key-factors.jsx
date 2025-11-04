import { Sparkles } from "lucide-react"

const factors = [
  { name: "Location", multiplier: "1.50x", impact: "Very High" },
  { name: "Area", multiplier: "1.00x", impact: "High" },
  { name: "Bedrooms", multiplier: "0.80x", impact: "Medium" },
  { name: "Bathrooms", multiplier: "0.60x", impact: "Medium" },
  { name: "Floors", multiplier: "0.40x", impact: "Low" },
  { name: "Age", multiplier: "-0.30x", impact: "Low" },
]

const getImpactColor = (impact) => {
  switch (impact) {
    case "Very High":
      return "text-emerald-600"
    case "High":
      return "text-teal-600"
    case "Medium":
      return "text-cyan-600"
    case "Low":
      return "text-slate-600"
    default:
      return "text-slate-800"
  }
}

export function KeyFactors() {
  return (
    <div className="mt-10 relative group">
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-xl bg-white/95 rounded-3xl p-8 shadow-xl border border-emerald-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Key Pricing Factors
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {factors.map((factor, index) => (
            <div
              key={index}
              className="relative group/factor animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 opacity-0 group-hover/factor:opacity-100 transition-opacity blur-sm"></div>
              <div className="relative bg-white rounded-2xl p-6 border border-emerald-200 hover:border-emerald-400 transition-all text-center hover:scale-105 shadow-lg">
                <p className="font-bold text-sm mb-2 text-slate-900">{factor.name}</p>
                <p className="font-bold text-2xl text-emerald-600 mb-2">{factor.multiplier}</p>
                <p className={`text-xs font-semibold ${getImpactColor(factor.impact)}`}>{factor.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}