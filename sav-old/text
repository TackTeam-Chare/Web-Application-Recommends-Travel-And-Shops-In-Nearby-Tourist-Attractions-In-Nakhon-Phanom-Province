"use client";

import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch, FaRuler } from "react-icons/fa";
import { TbFileDescription } from "react-icons/tb";
import { FallingLines } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchPlacesNearbyByCoordinates,
  searchTouristEntitiesUnified,
  fetchAllFilters,
} from "@/services/user/api";
import { Place, Season, District, Category } from "@/models/interface";
import Image from "next/image";
import MapComponent from "@/components/Map/MapComponent";
import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const GeocodingSearchPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ seasons: Season[]; districts: District[]; categories: Category[] }>({
    seasons: [],
    districts: [],
    categories: [],
  });
  const [searchParams, setSearchParams] = useState<{ q?: string; category?: number; district?: number; season?: number }>({});
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await fetchAllFilters();
        setFilters(data);
        // ลบการแสดง toast สำหรับการโหลดตัวกรอง
      } catch (error) {
        console.error("Error fetching filters:", error);
        // ลบการแสดง toast สำหรับการโหลดตัวกรองไม่สำเร็จ
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
          toast.error("ไม่สามารถดึงตำแหน่งผู้ใช้ได้ กรุณาเปิดการใช้งานตำแหน่ง"); // แสดง alert เมื่อไม่สามารถเช็คพิกัดผู้ใช้ได้
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
      
      // แสดง Alert เมื่อพบสถานที่ใกล้เคียง
      if (data.length > 0) {
        toast.success(`พบสถานที่ใกล้เคียง ${data.length} แห่ง!`);
      }
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      toast.error("ไม่สามารถดึงสถานที่ใกล้เคียงได้"); // แสดง alert เมื่อเกิด error ในการดึงข้อมูลสถานที่ใกล้เคียง
      setNearbyPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const searchPlaces = async (params: typeof searchParams) => {
    try {
      setLoading(true);
      const data = await searchTouristEntitiesUnified(params);
      setSearchResults(data);

      // If search results exist, update the map center to the first result's location
      if (data.length > 0) {
        const firstResult = data[0];
        setMapCenter({ lat: Number(firstResult.latitude), lng: Number(firstResult.longitude) });
        toast.success(`พบ ${data.length} เเห่ง`); // แสดง alert เมื่อค้นหาแล้วพบสถานที่
      } else {
        toast.info("ไม่พบผลลัพธ์สำหรับการค้นหาของคุณ");
      }
    } catch (error) {
      console.error("Error searching places:", error);
      toast.error("ไม่สามารถทำการค้นหาได้"); // แสดง alert เมื่อเกิด error ในการค้นหา
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByField = (field: keyof typeof searchParams, value: string | number) => {
    const updatedParams = { q: undefined, category: undefined, district: undefined, season: undefined, [field]: value };
    setSearchParams(updatedParams);
    searchPlaces(updatedParams);
  };

  const handleCurrentLocationClick = () => {
    if (userLocation) {
      fetchNearbyPlaces(userLocation.lat, userLocation.lng);
      setMapCenter(userLocation); // Center map to user location
    }
  };

  const clearSearch = () => {
    setSearchParams({});
    setSearchResults([]);
    setNearbyPlaces([]);
    if (userLocation) {
      setMapCenter(userLocation); // Reset map center to user's location
    }
    // ลบ toast สำหรับการล้างการค้นหา
  };

  return (
    <div className="container mx-auto p-4 relative">
      {/* ToastContainer to display notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <h1 className="text-4xl font-bold text-center text-orange-500 mb-4">สถานที่ใกล้เคียง</h1>
      {/* Search Filters and Check Current Location Button */}
      <div className="flex flex-wrap gap-3 mb-6 items-center justify-center">
        <button
          onClick={handleCurrentLocationClick}
          className="bg-orange-500 text-white py-2 px-4 rounded-full flex items-center hover:bg-orange-600 transition duration-300"
          aria-label="Check current location"
        >
          <FaMapMarkerAlt className="mr-2" />
          เช็คตำแหน่งปัจจุบัน
        </button>

        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
          <input
            type="text"
            placeholder="ค้นหาชื่อสถานที่"
            className="p-2 pl-10 border border-orange-500 rounded w-full focus:outline-none focus:border-orange-600"
            value={searchParams.q || ""}
            onChange={(e) => handleSearchByField("q", e.target.value)}
            aria-label="Search by place name"
          />
        </div>

        <div className="relative w-full max-w-xs">
          <select
            value={searchParams.category || ""}
            onChange={(e) => handleSearchByField("category", Number(e.target.value))}
            className="p-2 pl-3 border border-orange-500 rounded w-full focus:outline-none focus:border-orange-600"
            aria-label="Select category"
          >
            <option value="">เลือกหมวดหมู่</option>
            {filters.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full max-w-xs">
          <select
            value={searchParams.district || ""}
            onChange={(e) => handleSearchByField("district", Number(e.target.value))}
            className="p-2 pl-3 border border-orange-500 rounded w-full focus:outline-none focus:border-orange-600"
            aria-label="Select district"
          >
            <option value="">เลือกอำเภอ</option>
            {filters.districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full max-w-xs">
          <select
            value={searchParams.season || ""}
            onChange={(e) => handleSearchByField("season", Number(e.target.value))}
            className="p-2 pl-3 border border-orange-500 rounded w-full focus:outline-none focus:border-orange-600"
            aria-label="Select season"
          >
            <option value="">เลือกฤดูกาล</option>
            {filters.seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={clearSearch}
          className="bg-gray-300 text-black py-2 px-4 rounded-full"
          aria-label="Clear search"
        >
          ล้างการค้นหา
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <FallingLines width="100" color="#4fa94d" visible={true} />
        </div>
      )}

      {/* MapComponent Integration */}
      <div className={`w-full h-96 mb-6 ${loading ? "blur-sm" : ""}`}>
        <MapComponent
          isLoaded={isLoaded}
          userLocation={userLocation}
          mapCenter={mapCenter}
          searchResults={searchResults}
          nearbyPlaces={nearbyPlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={setSelectedPlace}
          clearSearch={clearSearch}
        />
      </div>

      {/* Display search query and results count */}
      <div className="mt-4">
        {searchParams.q && (
          <p className="text-lg font-bold text-center text-orange-500 mb-4">
            คำที่ค้นหา: &quot;{searchParams.q}&quot; (พบ {searchResults.length} ผลลัพธ์)
          </p>
        )}
        {/* Display search results separately */}
        <h2 className="text-2xl font-bold text-orange-500 mb-4">ผลลัพธ์การค้นหา (พบ {searchResults.length} ผลลัพธ์)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col"
              onMouseEnter={() => setMapCenter({ lat: Number(place.latitude), lng: Number(place.longitude) })}
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
                  {place.district_name}
                </p>
                <p className="text-gray-600 flex items-center mb-2">
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
              onMouseEnter={() => setMapCenter({ lat: Number(place.latitude), lng: Number(place.longitude) })}
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
                  {place.district_name}
                </p>
                <p className="text-gray-600 flex items-center mb-2">
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
