"use client";
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaMapPin, FaInfoCircle, FaRuler } from 'react-icons/fa';
import { TbFileDescription } from "react-icons/tb";
import { FallingLines } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { fetchPlacesNearbyByCoordinates, searchTouristEntitiesUnified, fetchAllFilters } from '@/services/user/api';
import { Place, Season, District, Category } from '@/models/interface';
import Image from 'next/image';
import debounce from 'lodash.debounce';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

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

const GeocodingSearchPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ seasons: Season[]; districts: District[]; categories: Category[] }>({
    seasons: [],
    districts: [],
    categories: []
  });
  const [searchParams, setSearchParams] = useState<{ q?: string, category?: number, district?: number, season?: number }>({});
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await fetchAllFilters();
        setFilters(data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const updateLocation = () => {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyPlaces(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting user's location:", error);
          setLoading(false);
        }
      );
    };

    updateLocation();
  }, []);

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const data = await fetchPlacesNearbyByCoordinates(lat, lng, 5000);
      setNearbyPlaces(data);
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      setNearbyPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = debounce(async (newParams: { q?: string; category?: number; district?: number; season?: number }) => {
    setSearchParams(newParams);
    await searchPlaces(newParams);
  }, 300); // 300ms debounce time

  const searchPlaces = async (params: typeof searchParams) => {
    try {
      setLoading(true);
      const data = await searchTouristEntitiesUnified(params);
      setSearchResults(data);

      // If search results exist, update the map center to the first result's location
      if (data.length > 0) {
        const firstResult = data[0];
        setMapCenter({ lat: Number(firstResult.latitude), lng: Number(firstResult.longitude) });
        if (mapRef.current) {
          mapRef.current.panTo({ lat: Number(firstResult.latitude), lng: Number(firstResult.longitude) });
          mapRef.current.setZoom(14); // Adjust zoom level as needed
        }
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocationClick = () => {
    if (userLocation && mapRef.current) {
      fetchNearbyPlaces(userLocation.lat, userLocation.lng);
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(16); // Zoom in to user location
    }
  };

  const handleCardHover = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(16);
    }
  };

  const clearSearch = () => {
    setSearchParams({});
    setSearchResults([]);
    setNearbyPlaces([]);
    if (userLocation) {
      setMapCenter(userLocation); // Reset map center to user's location
      if (mapRef.current) {
        mapRef.current.panTo(userLocation);
        mapRef.current.setZoom(14);
      }
    }
  };

  const getIconForPlaceType = (type: string) => {
    switch (type) {
      case 'amusement_park':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon5.png';
      case 'aquarium':
        return 'http://maps.google.com/mapfiles/kml/pal2/icon13.png';
      //... (other cases)
      default:
        return 'http://maps.google.com/mapfiles/kml/pal2/icon5.png';
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FallingLines width="100" color="#4fa94d" visible={true} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-4xl font-bold text-center text-orange-500 mb-4">สถานที่ใกล้เคียง</h1>
      
      {/* Search Filters and Check Current Location Button */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <button
          onClick={handleCurrentLocationClick}
          className="bg-orange-500 text-white py-2 px-4 rounded-full flex items-center hover:bg-orange-600 transition duration-300"
        >
          <FaMapMarkerAlt className="mr-2" />
          เช็คตำแหน่งปัจจุบัน
        </button>

        <input
          type="text"
          placeholder="ค้นหาชื่อสถานที่"
          className="p-2 border rounded"
          value={searchParams.q || ''}
          onChange={(e) => handleSearchChange({ ...searchParams, q: e.target.value })}
        />
        <select
          value={searchParams.category || ''}
          onChange={(e) => handleSearchChange({ ...searchParams, category: Number(e.target.value) })}
          className="p-2 border rounded"
        >
          <option value="">เลือกหมวดหมู่</option>
          {filters.categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select
          value={searchParams.district || ''}
          onChange={(e) => handleSearchChange({ ...searchParams, district: Number(e.target.value) })}
          className="p-2 border rounded"
        >
          <option value="">เลือกอำเภอ</option>
          {filters.districts.map(district => (
            <option key={district.id} value={district.id}>{district.name}</option>
          ))}
        </select>
        <select
          value={searchParams.season || ''}
          onChange={(e) => handleSearchChange({ ...searchParams, season: Number(e.target.value) })}
          className="p-2 border rounded"
        >
          <option value="">เลือกฤดูกาล</option>
          {filters.seasons.map(season => (
            <option key={season.id} value={season.id}>{season.name}</option>
          ))}
        </select>
        <button
          onClick={clearSearch}
          className="bg-gray-300 text-black py-2 px-4 rounded-full"
        >
          ล้างการค้นหา
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <FallingLines width="100" color="#4fa94d" visible={true} />
        </div>
      )}

      <div className={`w-full h-96 mb-6 ${loading ? 'blur-sm' : ''}`}>
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
          {/* Marker for User's Current Location */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: '/user.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )}

          {/* Markers for Search Results */}
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
                onClick={() => setSelectedPlace(place)}
              />
            );
          })}

          {/* Markers for Nearby Places */}
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
                onClick={() => setSelectedPlace(place)}
              />
            );
          })}

          {/* InfoWindow for Selected Place */}
          {selectedPlace && (
            <InfoWindow
              position={{ lat: Number(selectedPlace.latitude), lng: Number(selectedPlace.longitude) }}
              onCloseClick={() => setSelectedPlace(null)}
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
      </div>

      {/* Display search results separately */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">ผลลัพธ์การค้นหา (พบ {searchResults.length} ผลลัพธ์)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((place) => (
            <div 
              key={place.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col"
              onMouseEnter={() => handleCardHover(Number(place.latitude), Number(place.longitude))}
            >
              {place.images && place.images[0]?.image_url ? (
                <Image
                  src={place.images[0].image_url ?? "/default-image.jpg"}
                  alt={place.name}
                  className="rounded-lg mb-4 object-cover w-full h-48"
                  width={500}
                  height={300}
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
                {place.distance !== undefined && place.distance !== null ? (
                  <p className="text-gray-600 flex items-center mb-2">
                    <FaRuler className="mr-2 text-orange-500" />
                    {place.distance.toFixed(2)} กม.
                  </p>
                ) : (
                  <p className="text-gray-600 flex items-center mb-2">
                    <FaRuler className="mr-2 text-orange-500" />
                    ไม่ทราบระยะทาง
                  </p>
                )}
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

      {/* Display nearby places separately */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">สถานที่ใกล้เคียง (พบ {nearbyPlaces.length} สถานที่)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyPlaces.map((place) => (
            <div 
              key={place.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col"
              onMouseEnter={() => handleCardHover(Number(place.latitude), Number(place.longitude))}
            >
              {place.images && place.images[0]?.image_url ? (
                <Image
                  src={place.images[0].image_url ?? "/default-image.jpg"}
                  alt={place.name}
                  className="rounded-lg mb-4 object-cover w-full h-48"
                  width={500}
                  height={300}
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
                {place.distance !== undefined && place.distance !== null ? (
                  <p className="text-gray-600 flex items-center mb-2">
                    <FaRuler className="mr-2 text-orange-500" />
                    {place.distance.toFixed(2)} กม.
                  </p>
                ) : (
                  <p className="text-gray-600 flex items-center mb-2">
                    <FaRuler className="mr-2 text-orange-500" />
                    ไม่ทราบระยะทาง
                  </p>
                )}
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

export default GeocodingSearchPage;
