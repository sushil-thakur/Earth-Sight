import { MapPin } from "lucide-react"

const mapCities = [
  { name: "Kathmandu", x: 50, y: 45, size: "large" },
  { name: "Lalitpur", x: 52, y: 48, size: "large" },
  { name: "Bhaktapur", x: 55, y: 46, size: "medium" },
  { name: "Pokhara", x: 35, y: 50, size: "large" },
  
  { name: "Chitwan", x: 45, y: 60, size: "medium" },
  { name: "Butwal", x: 38, y: 65, size: "small" },

]

export function InteractiveMap({ selectedLocation, onLocationSelect }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <MapPin className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Select Location
          </h3>
        </div>

        <div className="relative bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <svg viewBox="0 0 100 100" className="w-full h-auto">
            {/* Nepal Map Outline (simplified) */}
            <path
              d="M 10 50 Q 20 30, 40 35 T 70 30 Q 85 35, 90 45 L 88 55 Q 85 65, 75 68 T 50 70 Q 30 68, 20 65 L 15 58 Z"
              fill="rgba(99, 102, 241, 0.1)"
              stroke="rgba(99, 102, 241, 0.5)"
              strokeWidth="0.5"
              className="transition-all duration-300"
            />

            {/* City Markers */}
            {mapCities.map((city) => {
              const isSelected = selectedLocation === city.name
              const sizeMap = { large: 4, medium: 3, small: 2.5 }
              const size = sizeMap[city.size]

              return (
                <g key={city.name} className="cursor-pointer group/city" onClick={() => onLocationSelect(city.name)}>
                  {/* Glow effect for selected city */}
                  {isSelected && (
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={size + 2}
                      fill="rgba(6, 182, 212, 0.3)"
                      className="animate-pulse"
                    />
                  )}

                  {/* City dot */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={size}
                    fill={isSelected ? "rgb(6, 182, 212)" : "rgb(99, 102, 241)"}
                    className="transition-all duration-300 group-hover/city:scale-125"
                    stroke="white"
                    strokeWidth="0.5"
                  />

                  {/* City label */}
                  <text
                    x={city.x}
                    y={city.y - size - 2}
                    textAnchor="middle"
                    fill={isSelected ? "rgb(6, 182, 212)" : "rgb(148, 163, 184)"}
                    fontSize="3"
                    fontWeight={isSelected ? "bold" : "normal"}
                    className="transition-all duration-300 group-hover/city:fill-cyan-400 pointer-events-none"
                  >
                    {city.name}
                  </text>
                </g>
              )
            })}
          </svg>

          <p className="text-xs text-slate-400 text-center mt-4 font-medium">Click on a city to select location</p>
        </div>
      </div>
    </div>
  )
}