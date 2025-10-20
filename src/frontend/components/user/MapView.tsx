'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Coordinates } from '@/lib/geolocation';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

export interface MapMarker {
  id: string;
  position: Coordinates;
  title: string;
  description?: string;
  imageUrl?: string;
  onClick?: () => void;
}

interface MapViewProps {
  center: Coordinates;
  markers: MapMarker[];
  zoom?: number;
  height?: string;
  showUserLocation?: boolean;
  userLocation?: Coordinates | null;
  radiusInMiles?: number; // Show radius circle around user
}

export default function MapView({
  center,
  markers,
  zoom = 12,
  height = '500px',
  showUserLocation = true,
  userLocation,
  radiusInMiles,
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        className="flex items-center justify-center bg-monke-cream/20 rounded-lg border-2 border-monke-border"
        style={{ height }}
      >
        <Loader2 className="animate-spin text-monke-primary" size={40} />
      </div>
    );
  }

  // Convert miles to meters for Leaflet Circle
  const radiusInMeters = radiusInMiles ? radiusInMiles * 1609.34 : undefined;

  return (
    <div className="relative rounded-lg overflow-hidden border-2 border-monke-border shadow-lg" style={{ height }}>
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Tiles - Free, no API key required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {showUserLocation && userLocation && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              // You can add custom icon here if needed
            >
              <Popup>
                <div className="text-sm font-bold text-monke-primary">
                  Your Location
                </div>
              </Popup>
            </Marker>

            {/* Radius Circle */}
            {radiusInMeters && (
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={radiusInMeters}
                pathOptions={{
                  color: '#00ff4d',
                  fillColor: '#00ff4d',
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              />
            )}
          </>
        )}

        {/* Deal Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.latitude, marker.position.longitude]}
            eventHandlers={{
              click: () => {
                marker.onClick?.();
              },
            }}
          >
            <Popup>
              <div className="max-w-xs">
                {marker.imageUrl && (
                  <img
                    src={marker.imageUrl}
                    alt={marker.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                )}
                <div className="text-sm font-bold text-monke-primary mb-1">
                  {marker.title}
                </div>
                {marker.description && (
                  <div className="text-xs text-monke-primary/70">
                    {marker.description}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm border-2 border-monke-border rounded-lg p-3 shadow-lg">
        <div className="text-xs font-bold text-monke-primary mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          {showUserLocation && userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-monke-primary/80">Your Location</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-monke-primary/80">Deals</span>
          </div>
          {radiusInMiles && (
            <div className="text-monke-primary/60 mt-1">
              {radiusInMiles} mile radius
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
