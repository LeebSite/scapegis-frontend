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

const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20, 0], // Center on world view
        zoom: 2,
        zoomControl: false, // We'll add custom controls
        attributionControl: true,
      });

      // Add base tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);

      // Add custom zoom control in bottom right
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstanceRef.current);

      // Add scale control
      L.control.scale({
        position: 'bottomleft',
        metric: true,
        imperial: false
      }).addTo(mapInstanceRef.current);

      // Add some sample data (world countries outline)
      // This would typically come from your GIS data
      const worldBounds: L.LatLngBoundsExpression = [
        [-90, -180],
        [90, 180]
      ];
      
      // Add a sample rectangle to show the world bounds
      L.rectangle(worldBounds, {
        color: '#388e3c',
        weight: 2,
        fillOpacity: 0.1,
        fillColor: '#388e3c'
      }).addTo(mapInstanceRef.current);

      // Add some sample markers for major cities
      const cities = [
        { name: 'New York', lat: 40.7128, lng: -74.0060 },
        { name: 'London', lat: 51.5074, lng: -0.1278 },
        { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
        { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
        { name: 'São Paulo', lat: -23.5505, lng: -46.6333 }
      ];

      cities.forEach(city => {
        L.marker([city.lat, city.lng])
          .bindPopup(`<b>${city.name}</b><br>Lat: ${city.lat}<br>Lng: ${city.lng}`)
          .addTo(mapInstanceRef.current!);
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Attribution overlay */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded text-xs text-gray-600 z-[1000]">
        © OpenStreetMap | Data from OpenStreetMap
      </div>
    </div>
  );
};

export default MapContainer;
