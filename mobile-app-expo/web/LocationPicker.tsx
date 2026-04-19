import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon (leaflet asset issue with bundlers)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  readOnly?: boolean;
  height?: number;
}

function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== 0 || lng !== 0) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  readOnly = false,
  height = 300,
}: LocationPickerProps) {
  const hasLocation = latitude !== 0 || longitude !== 0;
  const center: [number, number] = hasLocation ? [latitude, longitude] : [20.5937, 78.9629]; // Default: India center
  const zoom = hasLocation ? 15 : 5;

  return (
    <div className="map-wrapper" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', borderRadius: 12 }}
        scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!readOnly && <MapClickHandler onLocationChange={onLocationChange} />}
        {hasLocation && <Marker position={[latitude, longitude]} />}
        <RecenterMap lat={latitude} lng={longitude} />
      </MapContainer>
      {!readOnly && (
        <p className="map-hint">Click on the map to set location</p>
      )}
    </div>
  );
}
