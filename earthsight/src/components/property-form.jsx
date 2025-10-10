export function PropertyForm({ formData, availableLocations, onFormChange }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Property Details
          </h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-indigo-300">Location</label>
            <select
              value={formData.location}
              onChange={(e) => onFormChange("location", e.target.value)}
              className="max-w-sm w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border border-indigo-500/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white"
              style={{ minWidth: 220 }}
            >
              <option value="">Select location</option>
              {availableLocations.length ? (
                availableLocations.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-slate-900">
                    {loc.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading locations...</option>
              )}
            </select>
          </div>

          {[
            { field: "area", label: "Area (sq ft)", placeholder: "e.g., 1500" },
            { field: "bedrooms", label: "Bedrooms", placeholder: "e.g., 3" },
            { field: "bathrooms", label: "Bathrooms", placeholder: "e.g., 2" },
            { field: "floors", label: "Floors", placeholder: "e.g., 2" },
            { field: "age", label: "Age (years)", placeholder: "e.g., 5" },
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-semibold mb-2 text-indigo-300">{label}</label>
              <input
                type="number"
                placeholder={placeholder}
                value={formData[field]}
                onChange={(e) => onFormChange(field, e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border border-indigo-500/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white placeholder:text-slate-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}