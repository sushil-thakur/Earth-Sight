import React, { useEffect, useRef, useState } from 'react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

// CesiumGlobe using npm-installed Cesium
export default function CesiumGlobe({ initialLongitude = 13.4050, initialLatitude = 52.52, ionToken } ) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const [lon, setLon] = useState(String(initialLongitude))
  const [lat, setLat] = useState(String(initialLatitude))
  const [ready, setReady] = useState(false)
  const [entitiesList, setEntitiesList] = useState([])

  // set base URL for Cesium static assets (copy-cesium should place files under /Cesium)
  if (typeof window !== 'undefined') window.CESIUM_BASE_URL = window.CESIUM_BASE_URL || '/Cesium'

  // Initialize viewer once on mount
  useEffect(() => {
    let mounted = true
    try {
      if (ionToken) {
        try { Cesium.Ion.defaultAccessToken = ionToken } catch (e) {}
      }
    } catch (e) {}

    const viewerOptions = {
      shouldAnimate: true,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      scene3DOnly: true,
      imageryProvider: new Cesium.OpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/' })
    }

    try {
      // destroy previous if any
      if (viewerRef.current && viewerRef.current.destroy) {
        try { viewerRef.current.destroy() } catch (e) {}
        viewerRef.current = null
      }
      viewerRef.current = new Cesium.Viewer(containerRef.current, viewerOptions)

      // scene defaults
      try { viewerRef.current.scene.globe.depthTestAgainstTerrain = true } catch (e) {}

      // attach global for debugging
      try { window.__cesium_viewer = viewerRef.current } catch (e) {}

      if (mounted) setReady(true)
    } catch (err) {
      console.error('Failed to init Cesium viewer', err)
    }

    return () => {
      mounted = false
      try { if (viewerRef.current && viewerRef.current.destroy) viewerRef.current.destroy() } catch (e) {}
      try { window.__cesium_viewer = null } catch (e) {}
    }
  }, [ionToken])

  // Periodically update entities debug list
  useEffect(() => {
    if (!ready) return
    const interval = setInterval(() => {
      try {
        const ents = viewerRef.current && viewerRef.current.entities && viewerRef.current.entities.values ? viewerRef.current.entities.values : []
        const list = ents.map(e => {
          let billboardScale = null
          try { billboardScale = e.billboard && e.billboard.scale ? (typeof e.billboard.scale.getValue === 'function' ? e.billboard.scale.getValue() : Number(e.billboard.scale)) : null } catch (er) { billboardScale = null }
          let pointPixel = null
          try { pointPixel = e.point && e.point.pixelSize ? (typeof e.point.pixelSize.getValue === 'function' ? e.point.pixelSize.getValue() : Number(e.point.pixelSize)) : null } catch (er) { pointPixel = null }
          return { id: e.id || '(no-id)', billboardScale, pointPixel }
        })
        setEntitiesList(list)
      } catch (e) {}
    }, 600)
    return () => clearInterval(interval)
  }, [ready])

  const forceSanitize = () => {
    try {
      const ents = viewerRef.current && viewerRef.current.entities && viewerRef.current.entities.values ? viewerRef.current.entities.values : []
      for (let i = 0; i < ents.length; i++) {
        const e = ents[i]
        try {
          if (e && e.billboard) {
            try { e.billboard.scale = 2.0 } catch (er) {}
          }
          if (e && e.point) {
            try { e.point.pixelSize = 10 } catch (er) {}
          }
        } catch (er) {}
      }
      // refresh the debug list immediately
      const refreshed = (viewerRef.current.entities && viewerRef.current.entities.values) ? viewerRef.current.entities.values.map(e => ({ id: e.id || '(no-id)', billboardScale: e.billboard && e.billboard.scale ? (typeof e.billboard.scale.getValue === 'function' ? e.billboard.scale.getValue() : Number(e.billboard.scale)) : null, pointPixel: e.point && e.point.pixelSize ? (typeof e.point.pixelSize.getValue === 'function' ? e.point.pixelSize.getValue() : Number(e.point.pixelSize)) : null })) : []
      setEntitiesList(refreshed)
    } catch (e) { console.warn('forceSanitize failed', e) }
  }

  const loadLocation = () => {
    const lonNum = parseFloat(lon)
    const latNum = parseFloat(lat)
    if (!viewerRef.current || Number.isNaN(lonNum) || Number.isNaN(latNum)) return
    try {
      viewerRef.current.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(lonNum, latNum, 5000) })
      // best-effort: add OSM buildings and terrain
      try { if (Cesium && typeof Cesium.createOsmBuildings === 'function') viewerRef.current.scene.primitives.add(Cesium.createOsmBuildings()) } catch (e) {}
      try { if (Cesium && Cesium.createWorldTerrain) viewerRef.current.terrainProvider = Cesium.createWorldTerrain() } catch (e) {}
    } catch (e) { console.warn('loadLocation failed', e) }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-[520px] rounded-lg overflow-hidden" style={{ minHeight: 300 }} />

      {/* Controls */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-3 rounded-lg shadow z-20 w-64">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700">Longitude</label>
          <input value={lon} onChange={(e) => setLon(e.target.value)} className="mt-1 px-2 py-1 w-full border rounded" />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700">Latitude</label>
          <input value={lat} onChange={(e) => setLat(e.target.value)} className="mt-1 px-2 py-1 w-full border rounded" />
        </div>
        <button onClick={loadLocation} className="w-full bg-blue-600 text-white py-1 rounded">Load Location</button>
      </div>

      {/* Debug panel */}
      <div className="absolute right-4 top-4 w-64 bg-slate-900/85 text-white p-3 rounded z-30 text-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Entities</div>
          <button onClick={forceSanitize} className="ml-2 bg-emerald-600 px-2 py-0.5 rounded text-[11px]">Force Sanitize</button>
        </div>
        <div className="max-h-56 overflow-auto">
          {entitiesList.length === 0 && <div className="text-slate-300">No entities</div>}
          {entitiesList.map((e, i) => (
            <div key={i} className="flex justify-between gap-2 py-1 border-b border-slate-700/30">
              <div className="truncate">{e.id}</div>
              <div className="text-right">
                <div className="text-[11px] text-slate-300">b:{e.billboardScale ?? '-'}</div>
                <div className="text-[11px] text-slate-300">p:{e.pointPixel ?? '-'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
