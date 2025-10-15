import React, { useState, useMemo, useEffect, useRef } from 'react'
// Resium + Cesium
import { Viewer, Entity, CameraFlyTo, ImageryLayer } from 'resium'
import * as Cesium from 'cesium'
import { environmentApi } from '../utils/api'
// Cesium widgets CSS — requires cesium package assets to be available (see README notes below)
import 'cesium/Build/Cesium/Widgets/widgets.css'

/**
 * CesiumMap
 * Props: points = [{ id, lat, lng, title, description, color }]
 *
 * NOTE (setup): To use this component you must install the dependencies and configure Vite:
 *   npm install cesium resium
 *
 * In vite.config.js add (example):
 *   define: { global: 'window' },
 *   optimizeDeps: { include: ['cesium'] }
 *
 * Also set CESIUM_BASE_URL for runtime assets. Easiest approach for development:
 *   copy node_modules/cesium/Build/Cesium/ to public/Cesium
 * and set window.CESIUM_BASE_URL = '/Cesium' in index.html or before using Cesium.
 */

// Configure Cesium Ion token at module load so imagery/ion features can initialize correctly
try {
  if (typeof window !== 'undefined' && window.CESIUM_ION_TOKEN) {
    Cesium.Ion.defaultAccessToken = window.CESIUM_ION_TOKEN
  } else if (process && process.env && process.env.CESIUM_ION_TOKEN) {
    Cesium.Ion.defaultAccessToken = process.env.CESIUM_ION_TOKEN
  }
} catch (e) {
  // ignore in non-browser environments
}

export default function CesiumMap({ points = [] }) {
  const center = points && points.length ? [points[0].lng, points[0].lat] : [0, 0]

  const [terrainEnabled, setTerrainEnabled] = useState(false)
  const [satelliteEnabled, setSatelliteEnabled] = useState(false)
  const [customUrl, setCustomUrl] = useState('')
  const [markers, setMarkers] = useState(points || [])
  const [selected, setSelected] = useState(null)
  const [marineStats, setMarineStats] = useState(null)
  const [hoverInfo, setHoverInfo] = useState(null) // { image, description, species }
  const viewerRef = useRef(null)
  const markersByIdRef = useRef(new Map())
  const [showHint, setShowHint] = useState(true)

  // Render helper for marine stats (keeps JSX simpler to avoid nested ternary syntax issues)
  const renderMarineStats = () => {
    if (!marineStats) return <div className="text-xs text-slate-400">No usable marine stats returned</div>

    if (Array.isArray(marineStats)) {
      const max = Math.max(1, ...marineStats.map(m => Number(m.count || m.value || m.number || 0)))
      return (
        <div className="space-y-1">
          {marineStats.slice(0, 6).map((it, idx) => {
            const label = it.species || it.name || `item ${idx + 1}`
            const value = Number(it.count || it.value || it.number || 0)
            const w = Math.round((value / max) * 100)
            const speciesName = it.name || it.species || label
            return (
              <div key={idx} className="flex items-center gap-2">
                <div className="text-[10px] text-slate-300 w-20 truncate">{label}</div>
                <div
                  className="bg-slate-800 h-3 flex-1 rounded overflow-hidden cursor-pointer"
                  onMouseEnter={() => {
                    // fetch marine points for this species and set hover info
                    environmentApi.getMarineLife(speciesName).then((resp) => {
                      try {
                        const features = resp && resp.data && resp.data.features ? resp.data.features : []
                        if (features.length) {
                          const p = features[0]
                          const photo = p.properties && (p.properties.photoUrl || p.properties.photo) || null
                          const desc = p.properties && (p.properties.region || p.properties.mainSpecies || p.properties.description) || ''
                          setHoverInfo({ image: photo, description: desc, species: speciesName })
                        }
                      } catch (e) { /* ignore */ }
                    }).catch(() => {})
                  }}
                  onMouseLeave={() => setHoverInfo(null)}
                >
                  <div style={{ width: `${w}%` }} className="bg-emerald-500 h-3" />
                </div>
                <div className="text-[10px] text-slate-300 w-8 text-right">{value}</div>
              </div>
            )
          })}
        </div>
      )
    }

    if (typeof marineStats === 'object' && marineStats !== null) {
      const entries = Object.entries(marineStats).slice(0, 6)
      const max = Math.max(1, ...entries.map(([k, v]) => Number(v || 0)))
      return (
        <div className="space-y-1">
          {entries.map(([k, v], idx) => {
            const value = Number(v || 0)
            const w = Math.round((value / max) * 100)
            return (
              <div key={idx} className="flex items-center gap-2">
                <div className="text-[10px] text-slate-300 w-20 truncate">{k}</div>
                <div className="bg-slate-800 h-3 flex-1 rounded overflow-hidden">
                  <div style={{ width: `${w}%` }} className="bg-emerald-500 h-3" />
                </div>
                <div className="text-[10px] text-slate-300 w-8 text-right">{value}</div>
              </div>
            )
          })}
        </div>
      )
    }

    return <div className="text-xs text-slate-400">No usable marine stats returned</div>
  }

  const getSelectedPhotoUrl = (sel) => {
    if (!sel) return null
    // try common places where the backend/photo might live
    if (sel.photoUrl) return sel.photoUrl
    if (sel.photoURL) return sel.photoURL
    if (sel.raw && typeof sel.raw === 'object') {
      if (sel.raw.photoUrl) return sel.raw.photoUrl
      if (sel.raw.photoURL) return sel.raw.photoURL
      if (sel.raw.photo) return sel.raw.photo
      // sometimes backend uses mainSpecies -> map to a known photo URL in props
      if (sel.raw.mainSpecies && sel.raw.photoUrl) return sel.raw.photoUrl
    }
    return null
  }

  // Providers (memoized)
  const osmProvider = useMemo(() => new Cesium.UrlTemplateImageryProvider({ url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' }), [])
  const esriProvider = useMemo(() => new Cesium.UrlTemplateImageryProvider({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' }), [])
  const customProvider = useMemo(() => (customUrl ? new Cesium.UrlTemplateImageryProvider({ url: customUrl }) : null), [customUrl])

  const terrainProvider = useMemo(() => (terrainEnabled ? Cesium.createWorldTerrain({ requestWaterMask: true, requestVertexNormals: true }) : undefined), [terrainEnabled])

  // Fetch environment data when component mounts
  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        // backend returns { success: true, data: { type: 'FeatureCollection', features: [...] }, ... }
        const [dummyResp, statsResp, marineResp] = await Promise.all([
          environmentApi.getDummyData().catch(() => null),
          environmentApi.getStatistics().catch(() => null),
          environmentApi.getMarineLife().catch(() => null),
        ])

        if (!mounted) return

        const TYPE_COLORS = {
          deforestation: '#FF4444',
          mining: '#8B4513',
          forest_fire: '#FF8C00',
          marine_life: '#1e90ff',
          marine: '#1e90ff'
        }

        const normalizeFeatures = (fcResponse) => {
          if (!fcResponse || !fcResponse.data || !fcResponse.data.features) return []
          return (fcResponse.data.features || []).map((f) => {
            const coords = (f.geometry && f.geometry.coordinates) || [0, 0]
            const props = f.properties || {}
            const rawType = (props.type || props.dataType || (props.mainSpecies ? 'marine_life' : '') || '').toString()
            const normalizedType = rawType.toLowerCase()
            const mappedColor = props.color || props.colorHex || TYPE_COLORS[normalizedType] || '#f97316'
            return {
              id: props.id || props.ID || `${normalizedType || 'p'}_${Math.random().toString(36).slice(2, 9)}`,
              lat: Number(coords[1]) || 0,
              lng: Number(coords[0]) || 0,
              title: props.location || props.region || props.name || props.mainSpecies || props.title || props.id,
              description: props.description || props.region || props.mainSpecies || '',
              color: mappedColor,
              type: normalizedType || undefined,
              raw: props
            }
          })
        }

        const dummyMarkers = normalizeFeatures(dummyResp)
        const marineMarkers = normalizeFeatures(marineResp)

        // merge markers (dummy first, then marine overrides by id)
        const merged = new Map()
        dummyMarkers.forEach(m => merged.set(m.id, m))
        marineMarkers.forEach(m => merged.set(m.id, m))
        const mergedArr = Array.from(merged.values())
        if (mergedArr.length) setMarkers(mergedArr)
      } catch (e) {
        // ignore
      }
    }

    load()

    return () => { mounted = false }
  }, [])

  // Build a map of markers by id whenever markers update
  useEffect(() => {
    const m = new Map()
    ;(markers || []).forEach(item => {
      if (item && item.id) m.set(String(item.id), item)
    })
    markersByIdRef.current = m
  }, [markers])

  // Hide the click-hint after 10 seconds (or when user interacts)
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 10000)
    return () => clearTimeout(t)
  }, [])

  // Setup click/pick handler: when user clicks an Entity, set it selected and fetch marine stats if needed
  useEffect(() => {
    try {
      const viewer = viewerRef.current && viewerRef.current.cesiumElement

      if (!viewer) return
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene && viewer.scene.canvas)

      // Click handler: use markersByIdRef to find the normalized marker
      handler.setInputAction((click) => {
        const picked = viewer.scene.pick(click.position)
        if (!picked) return
        const entityObj = picked.id || (picked.primitive && picked.primitive.id)
        if (!entityObj) return

        // Try to resolve an identifier for lookup
        let pickedId = null
        try {
          if (typeof entityObj === 'string' || typeof entityObj === 'number') pickedId = String(entityObj)
          else if (entityObj.id && (typeof entityObj.id === 'string' || typeof entityObj.id === 'number')) pickedId = String(entityObj.id)
          else if (entityObj.properties && entityObj.properties.id) {
            const v = entityObj.properties.id
            pickedId = v && v.getValue ? String(v.getValue()) : String(v)
          } else if (entityObj.name) pickedId = String(entityObj.name)
        } catch (e) {
          pickedId = null
        }

        let marker = null
        if (pickedId && markersByIdRef.current) marker = markersByIdRef.current.get(String(pickedId))

        if (marker) {
          setSelected(marker)
        } else {
          // fallback: construct selected object from property bag (ensure raw is present)
          const props = entityObj.properties || {}
          const asObj = {}
          try {
            for (const key of Object.keys(props)) {
              asObj[key] = props[key] && props[key].getValue ? props[key].getValue() : props[key]
            }
          } catch (e) {
            for (const k in props) asObj[k] = props[k]
          }
          // Ensure raw exists for image lookup compatibility
          if (!asObj.raw) asObj.raw = asObj
          setSelected(asObj)
        }

        const chosen = marker || (entityObj && (entityObj.properties || {}))
        const typeStr = (marker && marker.type) || (chosen && (chosen.type || (chosen.raw && chosen.raw.type))) || ''
        const isMarine = String(typeStr).toLowerCase().includes('marine')
        if (isMarine && !marineStats) {
          environmentApi.getMarineLifeStatistics().then((ms) => {
            if (ms && ms.statistics && Array.isArray(ms.statistics.topSpecies)) {
              setMarineStats(ms.statistics.topSpecies)
            } else if (ms && ms.statistics) {
              setMarineStats(ms.statistics)
            } else if (Array.isArray(ms)) {
              setMarineStats(ms)
            } else {
              setMarineStats(null)
            }
          }).catch(() => {})
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // Hover handler: show small preview on mouse move
      handler.setInputAction((movement) => {
        try {
          const picked = viewer.scene.pick(movement.endPosition)
          if (!picked) {
            setHoverInfo(null)
            return
          }
          const entity = picked.id || (picked.primitive && picked.primitive.id)
          if (!entity) {
            setHoverInfo(null)
            return
          }

          let pickedId = null
          if (entity.id && (typeof entity.id === 'string' || typeof entity.id === 'number')) pickedId = String(entity.id)
          else if (entity.properties && entity.properties.id) {
            const v = entity.properties.id
            pickedId = v && v.getValue ? String(v.getValue()) : String(v)
          } else if (entity.name) pickedId = String(entity.name)

          const marker = pickedId && markersByIdRef.current ? markersByIdRef.current.get(String(pickedId)) : null
          if (marker) {
            const photo = marker.raw && (marker.raw.photoUrl || marker.raw.photo) || null
            const desc = marker.description || (marker.raw && (marker.raw.description || marker.raw.region || marker.raw.mainSpecies)) || ''
            const species = (marker.raw && (marker.raw.mainSpecies || marker.raw.name)) || marker.title
            setHoverInfo({ image: photo, description: desc, species })
            return
          }

          // Fallback to property bag parsing if marker not found
          if (entity.properties) {
            const props = entity.properties
            const asObj = {}
            try {
              for (const key of Object.keys(props)) {
                asObj[key] = props[key] && props[key].getValue ? props[key].getValue() : props[key]
              }
            } catch (e) {
              for (const k in props) asObj[k] = props[k]
            }
            const photo = (asObj.photoUrl || asObj.photoURL || (asObj.raw && asObj.raw.photoUrl) || (asObj.raw && asObj.raw.photo)) || null
            const desc = asObj.description || (asObj.raw && (asObj.raw.description || asObj.raw.region || asObj.raw.mainSpecies)) || ''
            const species = asObj.mainSpecies || asObj.title || asObj.region || asObj.name || asObj.id
            setHoverInfo({ image: photo, description: desc, species })
            return
          }

          setHoverInfo(null)
        } catch (e) {
          setHoverInfo(null)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      return () => {
        handler.destroy && handler.destroy()
      }
    } catch (e) {
      // ignore in environments without Cesium
    }
  }, [viewerRef.current, marineStats])

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-border/50 relative">
      {/* Controls overlay */}
      <div className="absolute top-3 left-3 z-50 bg-slate-900/80 p-2 rounded-md border border-slate-700/50 text-xs flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={terrainEnabled} onChange={(e) => setTerrainEnabled(e.target.checked)} />
          <span>Terrain</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={satelliteEnabled} onChange={(e) => setSatelliteEnabled(e.target.checked)} />
          <span>Satellite (Esri)</span>
        </label>
        <div className="flex items-center gap-2">
          <input value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="Custom XYZ URL (e.g. GEE tile proxy)" className="text-xs px-2 py-1 rounded bg-slate-800/60 border border-slate-700/40 w-56" />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={() => {
            const v = viewerRef.current && viewerRef.current.cesiumElement
            if (v && markers && markers.length > 0) {
              const m = markers[0]
              v.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(m.lng, m.lat, 2000000), duration: 1.5 })
            }
          }}>Center</button>
        </div>
      </div>
      
      {/* Small bottom-centered hint (dismissible) */}
      {showHint && !selected && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-4 z-50 bg-slate-900/90 px-3 py-2 rounded-md border border-slate-700/50 text-xs text-slate-200 cursor-pointer"
          onClick={() => setShowHint(false)}
          title="Click to dismiss"
        >
          Click a marker to see details
        </div>
      )}
  <Viewer ref={viewerRef} terrainProvider={terrainProvider} full={false} style={{ height: '100%', width: '100%' }} baseLayerPicker={false} timeline={false} animation={false} vrButton={false} homeButton={true}>
        {/* Default OSM base */}
        <ImageryLayer imageryProvider={osmProvider} />
        {/* Satellite toggle (Esri World Imagery overlay) */}
        {satelliteEnabled && <ImageryLayer imageryProvider={esriProvider} />}
        {/* custom provider (user can paste a GEE tile-proxy URL) */}
        {customProvider && <ImageryLayer imageryProvider={customProvider} />}

        {/* Removed automatic CameraFlyTo to avoid auto-centering on first marker.
            Users can pan/zoom freely. A manual 'Center' button is provided in the overlay below. */}

        {markers.map((p) => (
          <Entity
            key={p.id}
            id={p.id}
            name={p.title}
            position={Cesium.Cartesian3.fromDegrees(p.lng, p.lat)}
            properties={p}
            point={{ pixelSize: 12, color: Cesium.Color.fromCssColorString(p.color || '#f97316'), outlineColor: Cesium.Color.WHITE, outlineWidth: 2 }}
          />
        ))}
      </Viewer>


      {/* Info panel for selected marker */}
      <div className="absolute top-3 right-3 z-50 bg-slate-900/90 p-3 rounded-md border border-slate-700/50 text-sm w-72 max-h-80 overflow-auto">
        {selected ? (
          <div>
            <div className="font-semibold mb-1">{selected.title || selected.name}</div>
            <div className="text-xs text-slate-300 mb-2">{selected.description || selected.desc || ''}</div>
            <div className="text-xs text-slate-400 mb-2">Type: {selected.type || 'unknown'}</div>

            {/* Always show photo if available */}
            {(() => {
              const url = getSelectedPhotoUrl(selected)
              if (url) return <img src={url} alt={selected.title || 'image'} className="w-full h-28 object-cover rounded-md mb-2 border border-slate-700" />
              return null
            })()}

            {/* If this is a marine marker, show marine stats (fetching handled elsewhere) */}
            {((selected.type && String(selected.type).toLowerCase().includes('marine')) || (selected.raw && selected.raw.mainSpecies)) ? (
              <div className="mt-2">
                <div className="text-xs text-slate-300 mb-1">Marine life stats</div>
                <div className="space-y-1">{renderMarineStats()}</div>
              </div>
            ) : null}

            <div className="mt-3 text-right">
              <button className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600" onClick={() => { setSelected(null); setMarineStats(null) }}>Close</button>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-sm">Click a marker to see details</div>
        )}
      </div>
      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 z-50 bg-slate-900/85 p-2 rounded-md border border-slate-700/40 text-xs text-slate-200">
        <div className="font-semibold text-[12px] mb-1">Legend</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#FF4444' }}></span><span className="truncate">Deforestation</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#8B4513' }}></span><span className="truncate">Mining</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#FF8C00' }}></span><span className="truncate">Forest Fire</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#1e90ff' }}></span><span className="truncate">Marine life</span></div>
        </div>
      </div>
      {/* Hover tooltip for species bars */}
      {hoverInfo && (
        <div className="absolute top-24 right-3 z-60 bg-black/90 p-2 rounded-md border border-slate-700 text-xs w-56">
          {hoverInfo.image ? (
            <img src={hoverInfo.image} alt={hoverInfo.species} className="w-full h-20 object-cover rounded mb-2" />
          ) : null}
          <div className="font-semibold text-sm">{hoverInfo.species}</div>
          <div className="text-[11px] text-slate-300 truncate">{hoverInfo.description}</div>
        </div>
      )}
    </div>
  )
}
