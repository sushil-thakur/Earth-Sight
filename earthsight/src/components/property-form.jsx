export function PropertyForm({ formData, availableLocations, onFormChange, onUpdatePin }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-xl bg-white/95 rounded-3xl p-8 shadow-xl border border-emerald-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Property Details
          </h2>
        </div>

        <div className="space-y-5">
                {/* Latitude / Longitude fields (optional, populated from map clicks) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-emerald-700">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Click on map or type latitude"
                      value={formData.latitude || ''}
                      onChange={(e) => onFormChange('latitude', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-emerald-700">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Click on map or type longitude"
                      value={formData.longitude || ''}
                      onChange={(e) => onFormChange('longitude', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-emerald-700">Location (Optional)</label>
            <select
              value={formData.location}
              onChange={(e) => onFormChange("location", e.target.value)}
              className="max-w-sm w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800"
              style={{ minWidth: 220 }}
            >
              <option value="">Select location (Optional)</option>
              {availableLocations.length ? (
                availableLocations.map((loc, idx) => (
                  <option key={loc.id || loc.name || idx} value={loc.name} className="bg-white">
                    {loc.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading locations...</option>
              )}
            </select>
          </div>

          {[
            { field: "area", label: "Area (sq ft)", placeholder: "e.g., 1500", max: 10000, min: 1 },
            { field: "bedrooms", label: "Bedrooms", placeholder: "e.g., 3", max: 100, min: 0 },
            { field: "bathrooms", label: "Bathrooms", placeholder: "e.g., 2", max: 100, min: 0 },
            { field: "floors", label: "Floors", placeholder: "e.g., 2", max: 100, min: 1 },
            { field: "age", label: "Age (years)", placeholder: "e.g., 5", max: 200, min: 0 },
          ].map(({ field, label, placeholder, max, min }) => (
            <div key={field}>
              <label className="block text-sm font-semibold mb-2 text-emerald-700">{label}</label>
              <input
                type="number"
                placeholder={placeholder}
                value={formData[field]}
                onChange={(e) => onFormChange(field, e.target.value)}
                min={min}
                max={max}
                className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}