"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaRuler,
  FaHotel,
  FaUtensils,
  FaStore,
  FaTree,
  FaTimesCircle,
} from "react-icons/fa";
import { FallingLines } from "react-loader-spinner";
import Link from "next/link"; // Import Link from next/link
import "react-toastify/dist/ReactToastify.css";
import {
  fetchPlacesNearbyByCoordinates,
  searchTouristEntitiesUnified,
  fetchAllFilters,
} from "@/services/user/api";
import { Place, Season, District, Category } from "@/models/interface";
import Image from "next/image";
import { useJsApiLoader } from "@react-google-maps/api";

// Load MapComponent dynamically
const MapComponent = dynamic(() => import("@/components/Map/MapComponent"), {
  ssr: false,
});

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
  const [isClient, setIsClient] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    setIsClient(true); 
    const loadFilters = async () => {
      try {
        const data = await fetchAllFilters();
        setFilters(data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    if (!isClient) return; 

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
  }, [isClient]);

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

  const searchPlaces = async (params: typeof searchParams) => {
    try {
      setLoading(true);
      const data = await searchTouristEntitiesUnified(params);
      setSearchResults(data);

      if (data.length > 0) {
        const firstResult = data[0];
        setMapCenter({ lat: Number(firstResult.latitude), lng: Number(firstResult.longitude) });
      }
    } catch (error) {
      console.error("Error searching places:", error);
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
      setMapCenter(userLocation);
    }
  };

  const clearSearch = () => {
    setSearchParams({});
    setSearchResults([]);
    setNearbyPlaces([]);
    if (userLocation) {
      setMapCenter(userLocation);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const categorizePlaces = (categoryId: number) => {
    return nearbyPlaces.filter((place) => place.category_id === categoryId);
  };

  return (
    <div className="container mx-auto p-4 relative">
    
      {/* Search Bar and Buttons */}
      <div className="flex items-center justify-center mb-6"> {/* Updated layout to center the search bar */}
        
        <div className="relative w-full max-w-md mx-auto flex items-center justify-center">
        <button
          onClick={handleCurrentLocationClick}
          className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition duration-300"
          aria-label="Check current location"
        >
          <FaMapMarkerAlt />
        </button>
          
          <div className="relative w-full max-w-md mx-4"> {/* Centered and added margin to align properly */}
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสถานที่"
              className="p-2 pl-10 border border-orange-500 rounded w-full focus:outline-none focus:border-orange-600"
              value={searchParams.q || ""}
              onChange={(e) => handleSearchByField("q", e.target.value)}
              aria-label="Search by place name"
            />
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500"
              aria-label="Clear search"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Category and Season Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {filters.categories.map((category) => (
          <button
            key={category.id}
            className={`border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center ${searchParams.category === category.id ? 'bg-orange-500 text-white' : ''}`}
            onClick={() => handleSearchByField("category", category.id)}
          >
            {category.name === "สถานที่ท่องเที่ยว" && <FaTree className="mr-2" />}
            {category.name === "ที่พัก" && <FaHotel className="mr-2" />}
            {category.name === "ร้านอาหาร" && <FaUtensils className="mr-2" />}
            {category.name === "ร้านค้าของฝาก" && <FaStore className="mr-2" />}
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {filters.seasons.map((season) => (
          <button
            key={season.id}
            className={`border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center ${searchParams.season === season.id ? 'bg-orange-500 text-white' : ''}`}
            onClick={() => handleSearchByField("season", season.id)}
          >
            {season.name}
          </button>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <FallingLines width="100" color="#4fa94d" visible={true} />
        </div>
      )}

      {/* MapComponent Integration */}
      <div className={`w-full h-96 mb-6 ${loading ? "blur-sm" : ""}`}>
        {isClient && (
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
        )}
      </div>

      {/* Display search query and results count */}
      <div className="mt-4">
        {searchParams.q && (
          <p className="text-lg font-bold text-center text-orange-500 mb-4">
            คำที่ค้นหา: &quot;{searchParams.q}&quot; (พบ {searchResults.length} ผลลัพธ์)
          </p>
        )}

        {/* Display search results using Slider */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">ผลลัพธ์การค้นหา</h2>
            <Slider {...settings}>
              {searchResults.map((place) => (
                <Link href={`/place/${place.id}`} key={place.id}> {/* Link to the place detail page */}
                  <div className="p-4 cursor-pointer"> {/* Added cursor pointer for better UX */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <Image
                        src={place.images && place.images[0]?.image_url ? place.images[0].image_url : "/default-image.jpg"}
                        alt={place.name}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                        <p className="text-gray-600 mb-2">{place.description}</p>
                        <p className="text-orange-500 font-bold">{place.district_name}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        )}
      </div>

      {/* Display categorized places using sliders */}
      {filters.categories.map((category) => (
        <div key={category.id} className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">{category.name}</h2>
          <Slider {...settings}>
            {categorizePlaces(category.id).map((place) => (
              <Link href={`/place/${place.id}`} key={place.id}> {/* Link to the place detail page */}
                <div className="p-4 cursor-pointer"> {/* Added cursor pointer for better UX */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Image
                      src={place.images && place.images[0]?.image_url ? place.images[0].image_url : "/default-image.jpg"}
                      alt={place.name}
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                      <p className="text-gray-600 mb-2">{place.description}</p>
                      <p className="text-orange-500 font-bold">{place.district_name}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
};

export default GeocodingSearchPage;
