import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const defaultCenter = [0, 0]

function FitBounds({ points }) {
  const map = useMap()
  React.useEffect(() => {
    if (!points || points.length === 0) return
    const latLngs = points.map((p) => [p.lat, p.lng])
    try {
      map.fitBounds(latLngs, { padding: [40, 40] })
    } catch (e) {
      // ignore
    }
  }, [map, points])
  return null
}

export default function EnvironmentMap({ points = [] }) {
  // Points expected: { id, lat, lng, title, description, color }
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-border/50">
      <MapContainer center={defaultCenter} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {points.map((p) => (
          <React.Fragment key={p.id}>
            <CircleMarker center={[p.lat, p.lng]} radius={8} pathOptions={{ color: p.color || '#f97316', weight: 1, opacity: 0.9 }}>
              <Popup>
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.description}</div>
              </Popup>
            </CircleMarker>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  )
}
