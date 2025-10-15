import { MapPin } from "lucide-react"
import { useEffect, useRef, useState } from "react"

/**
 * Interactive Cesium Globe Map
 * Features:
 * - Click to place location pin
 * - Multiple imagery layer options
 * - Automatic lat/lon updates to parent form
 */

export function InteractiveMap({ onCoordinateSelect }) {
  const cesiumContainerRef = useRef(null)
  const viewerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCoords, setSelectedCoords] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cleanup = false
    let viewer = null

    const initCesium = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Suppress Cesium WebGL shader warnings
        const originalConsoleError = console.error
        console.error = (...args) => {
          const message = args[0]?.toString() || ''
          if (message.includes('[Cesium WebGL]') || 
              message.includes('Fragment shader') || 
              message.includes('shader compile')) {
            return // Suppress shader compilation warnings
          }
          originalConsoleError.apply(console, args)
        }

        // Set Cesium base URL
        window.CESIUM_BASE_URL = '/Cesium/'

        // Load Cesium CSS if not already loaded
        if (!document.querySelector('link[href*="widgets.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = '/Cesium/Widgets/widgets.css'
          document.head.appendChild(link)
        }

        // Load Cesium.js if not already loaded
        if (!window.Cesium) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = '/Cesium/Cesium.js'
            script.onload = resolve
            script.onerror = () => reject(new Error('Failed to load Cesium.js'))
            document.head.appendChild(script)
          })
        }

        if (cleanup) return

        const Cesium = window.Cesium

        // Wait for container
        let retries = 0
        while (!cesiumContainerRef.current && retries < 50) {
          await new Promise(r => setTimeout(r, 100))
          retries++
        }

        if (!cesiumContainerRef.current || cleanup) return

        // Set your valid Cesium Ion token
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNGZjY2ExMi1iNjMzLTQ5YmQtYTc1ZC03M2NhNTBlODUyYzgiLCJpZCI6MzQ5Njc4LCJpYXQiOjE3NjAyOTIxMTR9.xToz9dRY0rvzyBmqdHlNXLnd7gz6mzMhIwe90O6NbiY'

        // Create Bing Maps imagery provider as default
        const bingProvider = await Cesium.IonImageryProvider.fromAssetId(2)
        
        // Create viewer with compatibility settings
        viewer = new Cesium.Viewer(cesiumContainerRef.current, {
          imageryProvider: bingProvider,
          baseLayerPicker: true,
          animation: false,
          timeline: false,
          fullscreenButton: true,
          vrButton: false,
          homeButton: true,
          geocoder: true, // Enable geocoder search
          sceneModePicker: true,
          navigationHelpButton: true,
          infoBox: true,
          selectionIndicator: true,
          requestRenderMode: true, // Enable request render mode to reduce GPU load
          maximumRenderTimeChange: Infinity,
          contextOptions: {
            webgl: {
              alpha: false,
              depth: true,
              stencil: false,
              antialias: true,
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false
            }
          }
        })
        
        // Disable problematic features that might cause shader errors
        viewer.scene.globe.enableLighting = false
        viewer.scene.fog.enabled = false
        viewer.scene.skyAtmosphere.show = false

        viewerRef.current = viewer
        
        // Try to add Sentinel-2 imagery after viewer is ready
        setTimeout(() => {
          try {
            if (viewer && !viewer.isDestroyed() && viewer.baseLayerPicker) {
              Cesium.IonImageryProvider.fromAssetId(3954).then((sentinelProvider) => {
                viewer.baseLayerPicker.viewModel.imageryProviderViewModels.push(
                  new Cesium.ProviderViewModel({
                    name: 'Sentinel-2',
                    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/sentinel-2.png'),
                    tooltip: 'Sentinel-2 cloudless by EOX IT Services GmbH',
                    creationFunction: function() {
                      return sentinelProvider
                    }
                  })
                )
              }).catch(err => {
                console.warn('[InteractiveMap] Sentinel-2 not available:', err.message)
              })
            }
          } catch (err) {
            console.warn('[InteractiveMap] Sentinel-2 setup failed:', err.message)
          }
        }, 2000)

        // Enable globe and lighting
        viewer.scene.globe.show = true
        viewer.scene.globe.enableLighting = false
        viewer.scene.requestRenderMode = false

        // Set camera to show United States with good visibility
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(-98.5795, 39.8283, 5000000),
          orientation: {
            heading: 0.0,
            pitch: -Cesium.Math.PI_OVER_TWO,
            roll: 0.0
          }
        })

        // Force a render
        viewer.scene.requestRender()

        // Add click handler
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        
        handler.setInputAction((click) => {
          try {
            const ray = viewer.camera.getPickRay(click.position)
            const position = viewer.scene.globe.pick(ray, viewer.scene)
            
            if (!position) return

            const cartographic = Cesium.Cartographic.fromCartesian(position)
            const lat = Cesium.Math.toDegrees(cartographic.latitude)
            const lon = Cesium.Math.toDegrees(cartographic.longitude)

            // Update state
            setSelectedCoords({ lat, lon })

            // Notify parent
            if (onCoordinateSelect) {
              onCoordinateSelect({ lat, lon })
            }

            // Create pin marker
            const pinSVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                      fill="%2300f2ff" stroke="white" stroke-width="1.5"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `)}`

            const existingPin = viewer.entities.getById('selected-pin')
            if (existingPin) {
              existingPin.position = Cesium.Cartesian3.fromDegrees(lon, lat)
            } else {
              viewer.entities.add({
                id: 'selected-pin',
                position: Cesium.Cartesian3.fromDegrees(lon, lat),
                billboard: {
                  image: pinSVG,
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  scale: 1.5,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                label: {
                  text: `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
                  font: '14px sans-serif',
                  fillColor: Cesium.Color.WHITE,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 2,
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  verticalOrigin: Cesium.VerticalOrigin.TOP,
                  pixelOffset: new Cesium.Cartesian2(0, 10),
                  disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
              })
            }

            // Zoom IN to the selected location (10km altitude for street/neighborhood view)
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(lon, lat, 10000),
              duration: 1.5,
              orientation: {
                heading: 0.0,
                pitch: -Cesium.Math.PI_OVER_TWO,
                roll: 0.0
              }
            })
          } catch (err) {
            console.error('[InteractiveMap] Click handler error:', err)
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        setIsLoading(false)

      } catch (err) {
        console.error('[InteractiveMap] Init error:', err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    initCesium()

    return () => {
      cleanup = true
      if (viewer && !viewer.isDestroyed()) {
        try {
          viewer.destroy()
        } catch (e) {
          console.error('[InteractiveMap] Cleanup error:', e)
        }
      }
    }
  }, [onCoordinateSelect])

  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <MapPin className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Select Location
          </h3>
        </div>

        {/* Map Container */}
        <div className="relative bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 min-h-[420px]">
          <div 
            ref={cesiumContainerRef} 
            className="w-full h-[420px] rounded-lg overflow-hidden" 
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-2xl">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
                <div className="text-cyan-400 text-lg font-semibold">Loading Globe...</div>
                <div className="text-slate-400 text-sm mt-2">Initializing 3D Earth view</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 rounded-2xl">
              <div className="text-center p-6 max-w-md">
                <div className="text-red-400 text-lg font-semibold mb-2">Failed to load map</div>
                <div className="text-slate-400 text-sm mb-4">{error}</div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                >
                  Reload Page
                </button>
              </div>
            </div>
          )}

          {/* Selected Coordinates Display */}
          {selectedCoords && !isLoading && (
            <div className="absolute bottom-8 left-8 bg-slate-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-2xl border border-cyan-500/30">
              <div className="font-semibold text-cyan-400 mb-1">Selected Location</div>
              <div className="text-xs text-slate-300 font-mono">
                Lat: {selectedCoords.lat.toFixed(6)}
              </div>
              <div className="text-xs text-slate-300 font-mono">
                Lon: {selectedCoords.lon.toFixed(6)}
              </div>
            </div>
          )}

          {/* Instructions */}
          {!isLoading && !error && !selectedCoords && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-xl border border-cyan-500/30">
              <div className="text-sm text-center">
                <span className="text-cyan-400 font-semibold">Click anywhere</span>
                <span className="text-slate-300"> on the globe to select a location</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
