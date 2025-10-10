import React, { useState, useMemo } from 'react'
// Resium + Cesium
import { Viewer, Entity, CameraFlyTo, ImageryLayer } from 'resium'
import * as Cesium from 'cesium'
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

  // Providers (memoized)
  const osmProvider = useMemo(() => new Cesium.UrlTemplateImageryProvider({ url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' }), [])
  const esriProvider = useMemo(() => new Cesium.UrlTemplateImageryProvider({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' }), [])
  const customProvider = useMemo(() => (customUrl ? new Cesium.UrlTemplateImageryProvider({ url: customUrl }) : null), [customUrl])

  const terrainProvider = useMemo(() => (terrainEnabled ? Cesium.createWorldTerrain({ requestWaterMask: true, requestVertexNormals: true }) : undefined), [terrainEnabled])

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
      </div>

      <Viewer terrainProvider={terrainProvider} full={false} style={{ height: '100%', width: '100%' }} baseLayerPicker={false} timeline={false} animation={false} vrButton={false} homeButton={true}>
        {/* Default OSM base */}
        <ImageryLayer imageryProvider={osmProvider} />
        {/* Satellite toggle (Esri World Imagery overlay) */}
        {satelliteEnabled && <ImageryLayer imageryProvider={esriProvider} />}
        {/* custom provider (user can paste a GEE tile-proxy URL) */}
        {customProvider && <ImageryLayer imageryProvider={customProvider} />}

        {points && points.length > 0 && (
          <CameraFlyTo duration={1.5} destination={Cesium.Cartesian3.fromDegrees(points[0].lng, points[0].lat, 2000000)} />
        )}

        {points.map((p) => (
          <Entity
            key={p.id}
            name={p.title}
            position={Cesium.Cartesian3.fromDegrees(p.lng, p.lat)}
            point={{ pixelSize: 12, color: Cesium.Color.fromCssColorString(p.color || '#f97316'), outlineColor: Cesium.Color.WHITE, outlineWidth: 2 }}
          />
        ))}
      </Viewer>
    </div>
  )
}
