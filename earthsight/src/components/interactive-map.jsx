import { MapPin } from "lucide-react"
import { useEffect, useRef, useState } from "react"

// A simple set of fallback US locations (id, name, lat, lon)
const defaultUSLocations = [
  { id: 'ny', name: 'New York, NY', lat: 40.7128, lon: -74.0060 },
  { id: 'la', name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437 },
  { id: 'chi', name: 'Chicago, IL', lat: 41.8781, lon: -87.6298 },
  { id: 'hou', name: 'Houston, TX', lat: 29.7604, lon: -95.3698 },
  { id: 'phx', name: 'Phoenix, AZ', lat: 33.4484, lon: -112.0740 },
  { id: 'phi', name: 'Philadelphia, PA', lat: 39.9526, lon: -75.1652 },
  { id: 'sa', name: 'San Antonio, TX', lat: 29.4241, lon: -98.4936 },
  { id: 'sd', name: 'San Diego, CA', lat: 32.7157, lon: -117.1611 },
  { id: 'dal', name: 'Dallas, TX', lat: 32.7767, lon: -96.7970 },
  { id: 'sj', name: 'San Jose, CA', lat: 37.3382, lon: -121.8863 },
]

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180
  const R = 6371 // km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function InteractiveMap({ selectedLocation, onLocationSelect, availableLocations = [], onCoordinateSelect, controlledPosition, controlledColor, onPinConfirm }) {
  const cesiumContainerRef = useRef(null)
  const viewerRef = useRef(null)
  const popoverRef = useRef(null)
  const [cesiumLoaded, setCesiumLoaded] = useState(false)
  const [cesiumAttempts, setCesiumAttempts] = useState([])
  const locations = availableLocations.length ? availableLocations : defaultUSLocations
  const [showPopover, setShowPopover] = useState(false)
  const [popoverScreenPos, setPopoverScreenPos] = useState({ x: 0, y: 0 })
  const [currentPinColor, setCurrentPinColor] = useState(controlledColor || '#ff7a18')

  // Update billboard color safely
  const handlePinColorChange = (color) => {
    try {
      setCurrentPinColor(color)
      const ent = viewerRef.current && viewerRef.current.entities && viewerRef.current.entities.getById && viewerRef.current.entities.getById('selected-pin')
      if (ent && ent.billboard) {
        const c = color.replace('#', '%23')
        const svg = encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='${c}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z'/><circle cx='12' cy='11' r='2.5' fill='${c}' stroke='none'/></svg>`)
        ent.billboard.image = `data:image/svg+xml;charset=utf-8,${svg}`
      }
    } catch (err) {
      // ignore
    }
  }

  useEffect(() => {
  // Try to dynamically load Cesium. Prefer CDN first so the globe appears even when local build isn't served.
  const tryPaths = ['https://unpkg.com/cesium/Build/Cesium/Cesium.js', '/Cesium/Cesium.js', '/Cesium/Cesium/Cesium.js', '/Cesium.js']
    let loaded = false

    const loadScript = (src) => new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = src
      s.async = true
      s.onload = () => resolve(s)
      s.onerror = (ev) => reject(new Error('Failed to load ' + src))
      // document.head may be null in some edge environments — fall back to body
      const parent = document.head || document.getElementsByTagName('head')[0] || document.body || document.documentElement
      if (!parent) return reject(new Error('No document parent to append script'))
      parent.appendChild(s)
    })

  // Ensure Cesium knows where its static assets are hosted so widgets and workers load correctly
  try { window.CESIUM_BASE_URL = window.CESIUM_BASE_URL || '/Cesium' } catch (e) {}

  ;(async () => {
      const attempts = []
      for (const p of tryPaths) {
        try {
          await loadScript(p)
          attempts.push({ url: p, ok: !!window.Cesium })
          console.debug('[InteractiveMap] attempted load', p, 'window.Cesium=', !!window.Cesium)
          if (window.Cesium) {
            loaded = true
            console.info('[InteractiveMap] Cesium loaded from', p)
            break
          }
        } catch (e) {
          attempts.push({ url: p, ok: false, error: String(e) })
          console.warn('[InteractiveMap] failed to load', p, String(e))
          // try next
        }
      }
      setCesiumAttempts(attempts)

      if (!loaded || !window.Cesium) {
        setCesiumLoaded(false)
        console.warn('Cesium did not load. Make sure the Cesium build is available under /public/Cesium and that window.CESIUM_BASE_URL is set (see project README).')
        return
      }

      // initialize Cesium
      try {
        const Cesium = window.Cesium
        // Wait briefly for the container ref to be available (render may not have placed it yet)
        const waitForContainer = async (timeout = 500, interval = 25) => {
          const start = Date.now()
          while (!cesiumContainerRef.current && Date.now() - start < timeout) {
            // eslint-disable-next-line no-await-in-loop
            await new Promise(r => setTimeout(r, interval))
          }
          return !!cesiumContainerRef.current
        }

        const hasContainer = await waitForContainer()
        if (!hasContainer) {
          console.warn('Cesium container not mounted after wait; aborting viewer init')
          setCesiumLoaded(false)
          return
        }

        // If the app provides a CESIUM_ION_TOKEN on window, assign it
        try { if (window.CESIUM_ION_TOKEN) Cesium.Ion.defaultAccessToken = window.CESIUM_ION_TOKEN } catch (e) {}

        // basic viewer — prefer a tokenless fallback imagery provider (OpenStreetMap) so the globe displays
        try {
          viewerRef.current = new Cesium.Viewer(cesiumContainerRef.current, { timeline: false, animation: false, imageryProvider: new Cesium.OpenStreetMapImageryProvider(), baseLayerPicker: true })
        } catch (e) {
          // fallback to default if custom provider fails
          viewerRef.current = new Cesium.Viewer(cesiumContainerRef.current, { timeline: false, animation: false })
        }
        try { window.__earthsight_viewer = viewerRef.current } catch (e) {}

        // Only add markers if actual availableLocations were provided (avoid default blue dots)
        if (availableLocations && availableLocations.length) {
          locations.forEach(loc => {
            viewerRef.current.entities.add({
              id: loc.id,
              position: Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat),
              point: { pixelSize: 10, color: Cesium.Color.CYAN }
            })
          })
        }

        // click handler
        const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.scene.canvas)
        handler.setInputAction((click) => {
          try {
            // compute cartesian (use pickPosition when available)
            let cartesian = null
            try { cartesian = viewerRef.current.scene.pickPosition(click.position) } catch (e) { cartesian = null }
            if (!cartesian) {
              const ray = viewerRef.current.camera.getPickRay(click.position)
              if (ray) cartesian = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene)
            }
            if (!cartesian) return

            const carto = Cesium.Cartographic.fromCartesian(cartesian)
            const lat = Cesium.Math.toDegrees(carto.latitude)
            const lon = Cesium.Math.toDegrees(carto.longitude)

            // nearest location detection (optional)
            let nearest = null
            let nearestDist = Infinity
            locations.forEach(loc => {
              if (loc.lat == null || loc.lon == null) return
              const d = haversineDistance(lat, lon, loc.lat, loc.lon)
              if (d < nearestDist) { nearestDist = d; nearest = loc }
            })
            if (nearest) onLocationSelect && onLocationSelect(nearest.name)

            // prepare pin image and label
            const colorForSvg = (controlledColor || currentPinColor || '#ff7a18').replace('#', '%23')
            const svg = encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='${colorForSvg}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z'/><circle cx='12' cy='11' r='2.5' fill='${colorForSvg}' stroke='none'/></svg>`)
            const PIN_URL = `data:image/svg+xml;charset=utf-8,${svg}`

            // create or update selected-pin (billboard + label)
            const existing = viewerRef.current.entities.getById('selected-pin')
            if (existing) {
              existing.position = Cesium.Cartesian3.fromDegrees(lon, lat)
              if (existing.billboard) {
                existing.billboard.image = PIN_URL
                try { existing.billboard.scale = 3.0 } catch (e) {}
                try { existing.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY } catch (e) {}
              }
              if (existing.label) {
                existing.label.text = `${lat.toFixed(5)}, ${lon.toFixed(5)}`
                try { existing.label.disableDepthTestDistance = Number.POSITIVE_INFINITY } catch (e) {}
              }
            } else {
              viewerRef.current.entities.add({
                id: 'selected-pin',
                position: Cesium.Cartesian3.fromDegrees(lon, lat),
                billboard: { image: PIN_URL, verticalOrigin: Cesium.VerticalOrigin.BOTTOM, scale: 3.2, disableDepthTestDistance: Number.POSITIVE_INFINITY },
                label: { text: `${lat.toFixed(5)}, ${lon.toFixed(5)}`, font: '14px Roboto, sans-serif', style: Cesium.LabelStyle.FILL_AND_OUTLINE, outlineWidth: 2, verticalOrigin: Cesium.VerticalOrigin.TOP, pixelOffset: new Cesium.Cartesian2(0, -64), disableDepthTestDistance: Number.POSITIVE_INFINITY }
              })
            }

            // backup visible point
            try {
              const pt = viewerRef.current.entities.getById('selected-pin-point')
              if (pt) pt.position = Cesium.Cartesian3.fromDegrees(lon, lat)
              else viewerRef.current.entities.add({ id: 'selected-pin-point', position: Cesium.Cartesian3.fromDegrees(lon, lat), point: { pixelSize: 36, color: Cesium.Color.YELLOW, outlineColor: Cesium.Color.WHITE, outlineWidth: 3, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Number.POSITIVE_INFINITY } })
            } catch (e) {}

            // compute popover position and show
            try {
              const canvasPos = viewerRef.current.scene.cartesianToCanvasCoordinates(Cesium.Cartesian3.fromDegrees(lon, lat))
              if (canvasPos) setPopoverScreenPos({ x: canvasPos.x, y: canvasPos.y })
              setShowPopover(true)
            } catch (e) {}

            // log and fly camera to pin so it's visible (use a modest altitude)
            try { console.debug('[InteractiveMap] placing selected-pin at', lat, lon); viewerRef.current.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(lon, lat, 6000), duration: 0.8 }) } catch (e) {}

            // notify parent of the coordinates
            try { onCoordinateSelect && onCoordinateSelect({ lat: Number(lat), lon: Number(lon) }) } catch (e) {}
          } catch (err) {
            // ignore per-click errors
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        setCesiumLoaded(true)
      } catch (e) {
        console.warn('Cesium failed to initialize', e)
        setCesiumLoaded(false)
      }
    })()

    return () => {
      try {
        if (viewerRef.current && viewerRef.current.destroy) viewerRef.current.destroy()
      } catch (e) {}
    }
  }, [])

  // When parent provides controlledColor, sync it into local state
  useEffect(() => {
    if (controlledColor) setCurrentPinColor(controlledColor)
  }, [controlledColor])

  // Sync controlledPosition into the map (move or create the pin)
  useEffect(() => {
    if (!cesiumLoaded) return
    if (!controlledPosition || controlledPosition.lat == null || controlledPosition.lon == null) return
    try {
      const Cesium = window.Cesium
      const lat = Number(controlledPosition.lat)
      const lon = Number(controlledPosition.lon)
      const colorForSvg = (controlledColor || currentPinColor || '#ff7a18').replace('#', '%23')
      const svg = encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='${colorForSvg}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z'/><circle cx='12' cy='11' r='2.5' fill='${colorForSvg}' stroke='none'/></svg>`)
      const PIN_URL = `data:image/svg+xml;charset=utf-8,${svg}`
      const existing = viewerRef.current && viewerRef.current.entities && viewerRef.current.entities.getById && viewerRef.current.entities.getById('selected-pin')
      if (existing) {
        existing.position = Cesium.Cartesian3.fromDegrees(lon, lat)
        if (existing.billboard) existing.billboard.image = PIN_URL
        if (existing.label) existing.label.text = `${lat.toFixed(5)}, ${lon.toFixed(5)}`
      } else if (viewerRef.current) {
        viewerRef.current.entities.add({
          id: 'selected-pin',
          position: Cesium.Cartesian3.fromDegrees(lon, lat),
          billboard: { image: PIN_URL, verticalOrigin: Cesium.VerticalOrigin.BOTTOM, scale: 2.2 },
          label: { text: `${lat.toFixed(5)}, ${lon.toFixed(5)}`, font: '12px Roboto, sans-serif', style: Cesium.LabelStyle.FILL_AND_OUTLINE, outlineWidth: 2, verticalOrigin: Cesium.VerticalOrigin.TOP, pixelOffset: new Cesium.Cartesian2(0, -56) }
        })
      }

      try {
        const pt = viewerRef.current.entities.getById('selected-pin-point')
        if (pt) pt.position = Cesium.Cartesian3.fromDegrees(lon, lat)
        else viewerRef.current.entities.add({ id: 'selected-pin-point', position: Cesium.Cartesian3.fromDegrees(lon, lat), point: { pixelSize: 20, color: Cesium.Color.YELLOW, outlineColor: Cesium.Color.WHITE, outlineWidth: 2 } })
      } catch (e) {}

      try { viewerRef.current.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(lon, lat, 6000), duration: 0.8 }) } catch (e) {}
      try { const canvasPos = viewerRef.current.scene.cartesianToCanvasCoordinates(Cesium.Cartesian3.fromDegrees(lon, lat)); if (canvasPos) setPopoverScreenPos({ x: canvasPos.x, y: canvasPos.y }) } catch (e) {}
    } catch (err) {
      // ignore
    }
  }, [controlledPosition, controlledColor, cesiumLoaded])

  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <MapPin className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Select Location</h3>
        </div>

        <div className="relative bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 min-h-[300px] overflow-hidden">
          {/* Always render the container so the ref exists. If Cesium isn't loaded, show fallback overlay */}
          <div ref={cesiumContainerRef} className="w-full h-[420px] rounded-lg" style={{ maxHeight: '60vh', overflow: 'hidden' }} />

          {!cesiumLoaded && (
            <div className="absolute inset-0 flex flex-col items-stretch justify-start p-4 gap-3">
              <svg viewBox="0 0 100 100" className="w-full h-44 mb-0 opacity-80">
                <path d="M 5 60 Q 25 30, 40 35 T 70 30 Q 85 35, 95 45 L 92 55 Q 85 75, 75 78 T 50 80 Q 30 78, 15 68 L 10 62 Z" fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.25)" strokeWidth="0.4" />
              </svg>

              <p className="text-sm text-slate-300 mb-0">Cesium map not available. Use quick-select below or click a marker if available.</p>

              {cesiumAttempts && cesiumAttempts.length > 0 && (
                <div className="mt-2 p-3 rounded bg-rose-900/40 border border-rose-700 text-xs text-rose-100">
                  <div className="font-semibold mb-1">Cesium load diagnostics</div>
                  <div className="space-y-1 max-h-32 overflow-auto">
                    {cesiumAttempts.map((a, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1 ${a.ok ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                        <div className="break-all">{a.url} {a.ok ? ' — loaded' : ' — failed'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-200/80">If load failed, run <code>npm run copy-cesium</code> in the <code>earthsight</code> folder and restart dev server.</div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {locations.slice(0, 10).map((loc, idx) => (
                  <button key={loc.id || loc.name || idx} onClick={() => onLocationSelect && onLocationSelect(loc.name)} className={`px-3 py-2 rounded-lg bg-slate-700 hover:bg-cyan-500/20 text-sm text-white text-left ${selectedLocation === loc.name ? 'ring-2 ring-cyan-400' : ''}`}>
                    <div className="font-medium">{loc.name}</div>
                    {loc.lat && <div className="text-xs text-slate-400">{loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Popover overlay for the selected pin */}
      {cesiumLoaded && showPopover && (
        <div ref={popoverRef} style={{ position: 'absolute', left: popoverScreenPos.x, top: Math.max(0, popoverScreenPos.y - 80), transform: 'translate(-50%, -100%)', zIndex: 60 }}>
          <div className="bg-slate-900/95 text-white p-2 rounded-md shadow-lg animate-scale-in w-44 text-xs">
            <div className="font-semibold">Selected location</div>
            <div className="text-[12px] text-slate-300">Lat: {(controlledPosition && controlledPosition.lat) || ''}</div>
            <div className="text-[12px] text-slate-300">Lon: {(controlledPosition && controlledPosition.lon) || ''}</div>
            <div className="mt-2 flex items-center gap-2">
              <input type="color" value={currentPinColor} onChange={(e) => handlePinColorChange(e.target.value)} />
              <button className="px-2 py-1 bg-emerald-600 rounded text-[12px]" onClick={() => { onPinConfirm && onPinConfirm({ position: controlledPosition, color: currentPinColor }); setShowPopover(false) }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}