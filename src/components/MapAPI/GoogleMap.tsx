"use client";
import React, { useCallback, useRef } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const options: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
     
    ]
  };
  
interface GoogleMapComponentProps {
  lat: number;
  lng: number;
  nearbyEntities: { latitude: string; longitude: string; name: string }[];
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ lat, lng, nearbyEntities }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const center: google.maps.LatLngLiteral = {
    lat: Number(lat),
    lng: Number(lng),
  };

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      options={options}
      onLoad={onMapLoad}
    >
      {/* Marker for the main place */}
      <MarkerF position={center} />

      {/* Markers for nearby entities */}
      {nearbyEntities.map((entity, index) => (
        <MarkerF
          key={index}
          position={{ lat: Number(entity.latitude), lng: Number(entity.longitude) }}
          title={entity.name}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
