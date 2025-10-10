import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Star,
  Building2,
  ShoppingBag,
  GraduationCap,
  Hospital,
  TreePine,
  Home,
  MapPin,
} from "lucide-react"

export function MarketSummary({ location, locationData }) {
  if (!locationData) {
    return (
      <div className="relative group">
        <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-cyan-500/20">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Market Summary
            </h3>
          </div>
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Select a location to view market details</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {location} Market
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{locationData.priceChange}</span>
          </div>
        </div>

        {/* Market Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: TrendingUp, label: "Trend", value: locationData.trend, color: "indigo" },
            { icon: Star, label: "Score", value: `${Math.round(locationData.investmentScore)}/100`, color: "cyan" },
            {
              icon: BarChart3,
              label: "Properties",
              value: locationData.propertiesAnalyzed.toLocaleString(),
              color: "violet",
            },
            { icon: DollarSign, label: "Avg Price", value: locationData.averagePrice, color: "blue" },
          ].map(({ icon: Icon, label, value }, idx) => (
            <div key={idx} className="relative group/card">
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-indigo-500/50 to-cyan-500/50 opacity-0 group-hover/card:opacity-100 transition-opacity blur-sm"></div>
              <div className="relative backdrop-blur-xl bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all">
                <div className="inline-flex p-2.5 rounded-lg bg-indigo-500/20 mb-3 shadow-lg">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-xs text-slate-400 mb-1 font-medium">{label}</p>
                <p className="text-lg font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Investment Score Meter */}
        <div className="mb-6 p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-300">Investment Score</span>
            <span className="text-2xl font-bold text-cyan-400">{locationData.investmentScore}/100</span>
          </div>
          <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 transition-all duration-1000 shadow-lg shadow-cyan-500/50"
              style={{ width: `${locationData.investmentScore}%` }}
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Key Amenities
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {locationData.amenities.map((amenity, idx) => {
              const icons = [ShoppingBag, GraduationCap, Hospital, TreePine]
              const Icon = icons[idx % icons.length]
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-indigo-500/30 transition-all"
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-slate-300 font-medium">{amenity}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Listings */}
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Home className="w-4 h-4 text-cyan-400" />
            Recent Listings
          </h4>
          <div className="space-y-3">
            {locationData.recentListings.map((listing, idx) => (
              <div
                key={idx}
                className="relative group/listing p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{listing.type}</span>
                  <span className="text-sm font-bold text-cyan-400">{listing.price}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Home className="w-3 h-3" />
                  <span>{listing.area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}