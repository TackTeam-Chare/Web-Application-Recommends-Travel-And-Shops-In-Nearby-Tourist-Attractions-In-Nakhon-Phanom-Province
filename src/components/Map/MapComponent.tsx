import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, Polyline, DirectionsRenderer } from '@react-google-maps/api';
import { Place } from '@/models/interface';

interface MapComponentProps {
  isLoaded: boolean;
  userLocation: { lat: number; lng: number } | null;
  mapCenter: { lat: number; lng: number };
  searchResults: Place[];
  nearbyPlaces: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place | null) => void;
  clearSearch: () => void; // Function to clear search
}

const mapStyles = [
  {
    featureType: 'all',
    elementType: 'geometry.fill',
    stylers: [{ color: '#e9e5dc' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#aadaff' }],
  },
];

const polylineOptions = {
  strokeColor: '#FF5733',
  strokeOpacity: 0.8,
  strokeWeight: 4,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: true,
};

const MapComponent: React.FC<MapComponentProps> = ({
  isLoaded,
  userLocation,
  mapCenter,
  searchResults,
  nearbyPlaces,
  selectedPlace,
  onSelectPlace,
  clearSearch,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (userLocation && (searchResults.length > 0 || nearbyPlaces.length > 0)) {
      calculateRoutes(userLocation, searchResults, nearbyPlaces);
    }
  }, [userLocation, searchResults, nearbyPlaces]);

  const calculateRoutes = (origin: { lat: number; lng: number }, searchResults: Place[], nearbyPlaces: Place[]) => {
    if (!window.google || !window.google.maps) return;

    const directionsService = new google.maps.DirectionsService();

    const destinations = [...searchResults, ...nearbyPlaces];

    directionsService.route(
      {
        origin,
        destination: destinations[0] ? { lat: Number(destinations[0].latitude), lng: Number(destinations[0].longitude) } : origin,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: destinations.slice(1).map(place => ({
          location: { lat: Number(place.latitude), lng: Number(place.longitude) },
          stopover: true
        })),
        optimizeWaypoints: true
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  const handleClearSearch = () => {
    setDirections(null); // Clear directions
    mapRef.current?.setCenter(mapCenter); // Reset map center
    clearSearch(); // Clear search results and other state
  };

  const getIconForPlaceType = (type: string) => {
    switch (type) {
      case 'สถานที่ท่องเที่ยว':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon5.png';
      case 'ที่พัก':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon13.png';
      case 'ร้านอาหาร':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon19.png';
      case 'ร้านค้าของฝาก':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon23.png';
      default:
        return 'http://maps.google.com/mapfiles/kml/pal2/icon5.png';
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={mapCenter}
      zoom={14}
      options={{
        styles: mapStyles,
        zoomControl: true,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        disableDefaultUI: false,
        clickableIcons: false,
      }}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            url: '/user.png',
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      )}

      {searchResults.map((place) => {
        const lat = Number(place.latitude);
        const lng = Number(place.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Invalid coordinates for place ID: ${place.id}`);
          return null;
        }

        return (
          <Marker
            key={place.id}
            position={{ lat, lng }}
            icon={{
              url: getIconForPlaceType(place.category_name),
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={() => onSelectPlace(place)}
          />
        );
      })}

      {nearbyPlaces.map((place) => {
        const lat = Number(place.latitude);
        const lng = Number(place.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Invalid coordinates for place ID: ${place.id}`);
          return null;
        }

        return (
          <Marker
            key={place.id}
            position={{ lat, lng }}
            icon={{
              url: getIconForPlaceType(place.category_name),
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={() => onSelectPlace(place)}
          />
        );
      })}

      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: '#FF5733',
              strokeOpacity: 0.8,
              strokeWeight: 6,
            },
          }}
        />
      )}

      {selectedPlace && (
        <InfoWindow
          position={{ lat: Number(selectedPlace.latitude), lng: Number(selectedPlace.longitude) }}
          onCloseClick={() => onSelectPlace(null)}
        >
          <div>
            <h3 className="text-lg font-bold">{selectedPlace.name}</h3>
            <p className="text-gray-600">{selectedPlace.district_name}</p>
            <p className="text-gray-600">
              {selectedPlace.distance ? selectedPlace.distance.toFixed(2) : 'ไม่ทราบ'} กม. จากคุณ
            </p>
            {selectedPlace.season_name && (
              <p className="text-gray-600">ฤดูกาล: {selectedPlace.season_name}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapComponent;
