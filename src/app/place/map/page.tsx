"use client";
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaMapPin, FaRuler, FaInfoCircle } from 'react-icons/fa';
import { TbFileDescription } from "react-icons/tb";
import { Rings } from 'react-loader-spinner'; // Import the loading spinner
import { fetchPlacesNearbyByCoordinates } from '@/services/user/api';
import { Place } from '@/models/interface';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

// Custom map styling for a modern look
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

const GeocodingPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // State to manage loading

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null); // Reference for the map instance

  useEffect(() => {
    const updateLocation = () => {
      setLoading(true); // Set loading to true when fetching the location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyPlaces(latitude, longitude);
          setLoading(false); // Set loading to false once the location is fetched
        },
        (error) => {
          console.error("Error getting user's location:", error);
          setLoading(false); // Set loading to false in case of an error
        }
      );
    };

    updateLocation();

    const locationUpdateInterval = setInterval(updateLocation, 5000);

    return () => clearInterval(locationUpdateInterval);
  }, []);

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    try {
      setLoading(true); // Set loading to true when fetching nearby places
      const data = await fetchPlacesNearbyByCoordinates(lat, lng, 5000);
      
      // Ensure data is an array and not null or undefined
      if (data && Array.isArray(data)) {
        const placesWithImages = data.map(place => ({
          ...place,
          images: place.images ? place.images.map(image => ({
            ...image,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          })) : [] // Handle cases where images are undefined or null
        }));
        setNearbyPlaces(placesWithImages);
      } else {
        console.error("Invalid data format received from API:", data);
        setNearbyPlaces([]); // Set to empty array if data is not valid
      }
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      setNearbyPlaces([]); // Set to empty array in case of an error
    } finally {
      setLoading(false); // Set loading to false once the fetching is complete
    }
  };

  const handleCurrentLocationClick = () => {
    if (userLocation && mapRef.current) {
      fetchNearbyPlaces(userLocation.lat, userLocation.lng);
      mapRef.current.panTo(userLocation); // Move the map to the user's location
      mapRef.current.setZoom(16); // Zoom in to a level that focuses on the user's location
    }
  };

  const getIconForPlaceType = (type: string) => {
    switch (type) {
      case 'restaurant':
        return '/icons/restaurant.png';
      case 'hotel':
        return '/icons/hotel.png';
      case 'park':
        return '/icons/park.png';
      // Add more cases for different place types
      default:
        return '/icons/default.png';
    }
  };

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-4xl font-bold text-center text-orange-500 mb-4">สถานที่ใกล้เคียง</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={handleCurrentLocationClick}
          className="bg-orange-500 text-white py-2 px-4 rounded-full flex items-center hover:bg-orange-600 transition duration-300"
        >
          <FaMapMarkerAlt className="mr-2" />
          เช็คตำแหน่งปัจจุบัน
        </button>
      </div>

      {loading && ( // Show loading spinner when loading
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <Rings
            height="150"
            width="150"
            color="#4fa94d"
            ariaLabel="loading-indicator"
          />
        </div>
      )}

      <div className={`w-full h-96 mb-6 ${loading ? 'blur-sm' : ''}`}>
        {userLocation && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={userLocation}
            zoom={14}
            options={{ 
              styles: mapStyles, 
              zoomControl: true, 
              mapTypeControl: false, 
              fullscreenControl: false,
              streetViewControl: false,
              disableDefaultUI: false, // Enables default UI
              clickableIcons: false, // To prevent clickable icons on the map
            }}
            onLoad={(map) => (mapRef.current = map)} // Save the map instance to the ref
          >
            {/* Marker for User's Current Location */}
            <Marker
              position={userLocation}
              icon={{
                url: '/user.png',
                scaledSize: new window.google.maps.Size(40, 40), // Corrected usage
              }}
            />

            {/* Markers for Nearby Places */}
            {nearbyPlaces.map((place) => place.latitude && place.longitude && (
              <Marker
                key={place.id}
                position={{ lat: place.latitude, lng: place.longitude }}
                icon={{ 
                  url: getIconForPlaceType(place.category_name), // Dynamically set icon based on place type
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                onClick={() => setSelectedPlace(place)}
              />
            ))}

            {/* InfoWindow for Selected Place */}
            {selectedPlace && (
              <InfoWindow
                position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div>
                  <h3 className="text-lg font-bold">{selectedPlace.name}</h3>
                  <p className="text-gray-600">{selectedPlace.district_name}</p>
                  <p className="text-gray-600">{selectedPlace.distance.toFixed(2)} กม. จากคุณ</p>
                  {selectedPlace.season_name && (
                    <p className="text-gray-600">ฤดูกาล: {selectedPlace.season_name}</p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">สถานที่ใกล้เคียง</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyPlaces.map((place) => (
            <div key={place.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col">
              {place.images && place.images[0] ? (
                <img
                  src={place.images[0].image_url}
                  alt={place.name}
                  className="rounded-lg mb-4 object-cover w-full h-48"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                  <span className="text-gray-500">ไม่มีรูปภาพ</span>
                </div>
              )}
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                <p className="text-gray-600 flex items-center mb-2">
                  <TbFileDescription className="mr-2 text-orange-500" />
                  {place.description}
                </p>
                <p className="text-gray-600 flex items-center mb-2">
                  <FaMapMarkerAlt className="mr-2 text-orange-500" />
                  {place.district_name}
                </p>
                <p className="text-gray-600 flex items-center mb-2">
                  <FaMapPin className="mr-2 text-orange-500" />
                  {place.category_name}
                </p>
                <p className="text-gray-600 flex items-center mb-2">
                  <FaRuler className="mr-2 text-orange-500" />
                  {place.distance.toFixed(2)} กม.
                </p>
                {place.season_name && (
                  <p className="text-gray-600 flex items-center mb-2">
                    <FaInfoCircle className="mr-2 text-orange-500" />
                    ฤดูกาล: {place.season_name}
                  </p>
                )}
                <div className="flex justify-end mt-auto">
                  <a href={`/place/${place.id}`} className="text-orange-500 mt-2 font-bold flex items-center hover:underline">
                    อ่านเพิ่มเติม
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeocodingPage;
