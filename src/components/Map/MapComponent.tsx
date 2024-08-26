import React, { useRef } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Place } from '@/models/interface';

interface MapComponentProps {
  isLoaded: boolean;
  userLocation: { lat: number; lng: number } | null;
  mapCenter: { lat: number; lng: number };
  searchResults: Place[];
  nearbyPlaces: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place | null) => void;
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

const MapComponent: React.FC<MapComponentProps> = ({
  isLoaded,
  userLocation,
  mapCenter,
  searchResults,
  nearbyPlaces,
  selectedPlace,
  onSelectPlace
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const getIconForPlaceType = (type: string) => {
    switch (type) {
      case 'amusement_park':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon5.png';
      case 'aquarium':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon13.png';
      case 'art_gallery':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon12.png';
      case 'atm':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon60.png';
      case 'bar':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon27.png';
      case 'bus_station':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon18.png';
      case 'cafe':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon19.png';
      case 'campground':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon20.png';
      case 'church':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon21.png';
      case 'clothing_store':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon22.png';
      case 'convenience_store':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon23.png';
      case 'department_store':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon24.png';
      case 'florist':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon26.png';
      case 'gas_station':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon27.png';
      case 'lodging':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon28.png';
      case 'movie_theater':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon29.png';
      case 'museum':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon30.png';
      case 'park':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon31.png';
      case 'parking':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon32.png';
      case 'restaurant':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon33.png';
      case 'shopping_mall':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon34.png';
      case 'spa':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon35.png';
      case 'store':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon36.png';
      case 'subway_station':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon37.png';
      case 'supermarket':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon38.png';
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

      {selectedPlace && (
        <InfoWindow
          position={{ lat: Number(selectedPlace.latitude), lng: Number(selectedPlace.longitude) }}
          onCloseClick={() => onSelectPlace(null)}
        >
          <div>
            <h3 className="text-lg font-bold">{selectedPlace.name}</h3>
            <p className="text-gray-600">{selectedPlace.district_name}</p>
            <p className="text-gray-600">{selectedPlace.distance ? selectedPlace.distance.toFixed(2) : 'ไม่ทราบ'} กม. จากคุณ</p>
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
