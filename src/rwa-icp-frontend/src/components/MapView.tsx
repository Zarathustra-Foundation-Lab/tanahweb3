
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  polygon?: [number, number][];
  markers?: { position: [number, number]; title: string; price?: string }[];
  className?: string;
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({
  center,
  zoom = 13,
  polygon,
  markers = [],
  className = "",
  height = "400px"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView(center, zoom);

    // Add tile layer with dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Add polygon if provided
    if (polygon && polygon.length > 0) {
      const polygonLayer = L.polygon(polygon, {
        color: '#00D4FF',
        weight: 3,
        opacity: 0.8,
        fillColor: '#00D4FF',
        fillOpacity: 0.2
      }).addTo(mapInstance.current);

      // Fit map to polygon bounds
      mapInstance.current.fitBounds(polygonLayer.getBounds(), { padding: [20, 20] });
    }

    // Add markers
    markers.forEach(marker => {
      const customIcon = L.divIcon({
        html: `
          <div class="flex flex-col items-center">
            <div class="bg-web3-cyan text-background rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold animate-glow">
              L
            </div>
            ${marker.price ? `<div class="bg-card text-foreground text-xs px-2 py-1 rounded mt-1 border border-border whitespace-nowrap">${marker.price}</div>` : ''}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, marker.price ? 60 : 40],
        iconAnchor: [20, marker.price ? 50 : 30]
      });

      L.marker(marker.position, { icon: customIcon })
        .bindPopup(`
          <div class="text-center">
            <h3 class="font-semibold text-lg mb-2">${marker.title}</h3>
            ${marker.price ? `<p class="text-web3-cyan font-mono text-xl">${marker.price}</p>` : ''}
          </div>
        `)
        .addTo(mapInstance.current!);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom, polygon, markers]);

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    />
  );
};

export default MapView;
