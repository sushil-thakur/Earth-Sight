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
          {/* Location - Full Width */}
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-800 uppercase tracking-wide">Location (Optional)</label>
            <select
              value={formData.location}
              onChange={(e) => onFormChange("location", e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800 font-medium"
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

          {/* Latitude / Longitude - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-800 uppercase tracking-wide">
                Latitude <span className="text-xs text-slate-500 normal-case">(Click map or enter)</span>
              </label>
              <input
                type="number"
                step="0.000001"
                placeholder="e.g., 41.2565"
                value={formData.latitude || ''}
                onChange={(e) => onFormChange('latitude', e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 placeholder:text-slate-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-800 uppercase tracking-wide">
                Longitude <span className="text-xs text-slate-500 normal-case">(Click map or enter)</span>
              </label>
              <input
                type="number"
                step="0.000001"
                placeholder="e.g., -105.5442"
                value={formData.longitude || ''}
                onChange={(e) => onFormChange('longitude', e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 placeholder:text-slate-500 font-medium"
              />
            </div>
          </div>

          {/* Area & Bedrooms - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-800 uppercase tracking-wide">
                Area (sq ft) <span className="text-xs text-emerald-600 normal-case">(500 - 10,000)</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 1,500"
                value={formData.area}
                onChange={(e) => onFormChange('area', e.target.value)}
                min={500}
                max={10000}
                className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-800 uppercase tracking-wide">
                Bedrooms <span className="text-xs text-emerald-600 normal-case">(1 - 10)</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 3"
                value={formData.bedrooms}
                onChange={(e) => onFormChange('bedrooms', e.target.value)}
                min={1}
                max={10}
                className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-500 font-medium"
              />
            </div>
          </div>

          {/* Bathrooms & Floors - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-800 uppercase tracking-wide">
                Bathrooms <span className="text-xs text-emerald-600 normal-case">(1 - 8)</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 2"
                value={formData.bathrooms}
                onChange={(e) => onFormChange('bathrooms', e.target.value)}
                min={1}
                max={8}
                className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-800 uppercase tracking-wide">
                Floors <span className="text-xs text-emerald-600 normal-case">(1 - 50)</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 2"
                value={formData.floors}
                onChange={(e) => onFormChange('floors', e.target.value)}
                min={1}
                max={5}
                className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-500 font-medium"
              />
            </div>
          </div>

          {/* Age - Full Width */}
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-800 uppercase tracking-wide">
              Property Age (years) <span className="text-xs text-emerald-600 normal-case">(0 - 100)</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 5 (New construction = 0)"
              value={formData.age}
              onChange={(e) => onFormChange('age', e.target.value)}
              min={0}
              max={100}
              className="w-full px-4 py-3.5 rounded-xl bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-500 font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  )
}