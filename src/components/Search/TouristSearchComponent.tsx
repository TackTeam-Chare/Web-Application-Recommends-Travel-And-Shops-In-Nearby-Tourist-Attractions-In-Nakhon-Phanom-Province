"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FaSearch,
  FaLayerGroup,
  FaCalendarAlt,
  FaTimesCircle,
  FaClock,
  FaLocationArrow,
  FaTree, FaBed, FaUtensils, FaStore,FaSun, FaSnowflake, FaLeaf, FaSeedling 
} from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FallingLines } from "react-loader-spinner";
import {
  fetchCategories,
  fetchDistricts,
  fetchSeasons,
  searchTouristPlaces,
  fetchPlacesNearbyByCoordinates,
} from "@/services/user/api";
import { Place, Category, District, Season } from "@/models/interface";
import Image from "next/image";
import Link from "next/link";

const TouristSearchComponent: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState({
    name: "",
    district_id: null as number | null,
    category_id: null as number | null,
    season_id: null as number | null,
    day_of_week: "",
    opening_time: "",
    closing_time: "",
  });

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Categorized Places
  const [touristPlaces, setTouristPlaces] = useState<Place[]>([]);
  const [accommodations, setAccommodations] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [souvenirShops, setSouvenirShops] = useState<Place[]>([]);

  // Toggle states
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showSeasonFilter, setShowSeasonFilter] = useState(false);
  const [showTimeFilter, setShowTimeFilter] = useState(false); // Time toggle for days and hours
  const [showDistrictFilter, setShowDistrictFilter] = useState(false);

  // Debounce state
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);

  // State for displaying selected search criteria
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");

  const [searchIconVisible, setSearchIconVisible] = useState(true); // State to toggle between search and clear icon

  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        const [districtData, categoryData, seasonData] = await Promise.all([
          fetchDistricts(),
          fetchCategories(),
          fetchSeasons(),
        ]);
        setDistricts(districtData);
        setCategories(categoryData);
        setSeasons(seasonData);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilterData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchTouristPlaces(
        searchParams.name,
        searchParams.district_id || undefined,
        searchParams.category_id || undefined,
        searchParams.season_id || undefined,
        searchParams.day_of_week,
        searchParams.opening_time,
        searchParams.closing_time
      );
  
      // ตรวจสอบว่ามี category_id ถูกส่งเข้ามา
      if (searchParams.category_id) {
        const filteredResults = results.filter(
          (place) => place.category_id === searchParams.category_id
        );
        setPlaces(filteredResults);
      } else {
        setPlaces(results);
      }
  
      if (
        searchParams.district_id ||
        searchParams.season_id ||
        searchParams.day_of_week ||
        searchParams.opening_time ||
        searchParams.closing_time
      ) {
        categorizePlaces(results);
      }
    } catch (error) {
      console.error("Error searching for places:", error);
    } finally {
      setLoading(false);
    }
  
    const criteria = [];
    if (searchParams.district_id) {
      const district = districts.find((d) => d.id === searchParams.district_id);
      criteria.push(`อำเภอ: ${district?.name}`);
    }
    if (searchParams.season_id) {
      const season = seasons.find((s) => s.id === searchParams.season_id);
      criteria.push(`ฤดูกาล: ${season?.name}`);
    }
    if (searchParams.day_of_week) {
      criteria.push(`วัน: ${searchParams.day_of_week}`);
    }
    if (searchParams.opening_time) {
      criteria.push(`เวลาเปิด: ${searchParams.opening_time}`);
    }
    if (searchParams.closing_time) {
      criteria.push(`เวลาปิด: ${searchParams.closing_time}`);
    }
    setSelectedCriteria(criteria.join(", "));
  };

  const categorizePlaces = (places: Place[]) => {
    const tourist = places.filter((place) => place.category_id === 1);
    const accommodation = places.filter((place) => place.category_id === 2);
    const restaurant = places.filter((place) => place.category_id === 3);
    const souvenirShop = places.filter((place) => place.category_id === 4);

    setTouristPlaces(tourist);
    setAccommodations(accommodation);
    setRestaurants(restaurant);
    setSouvenirShops(souvenirShop);
  };

  const handleSearchChange = (field: keyof typeof searchParams, value: any) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [field]: value,
    }));
    setSearchIconVisible(false);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      handleSearch();
    }, 300); // ลดดีเลย์เพื่อทำให้เรียลไทม์มากขึ้น
    setDebounceTimer(newTimer);
  };

  const handleClearSearch = () => {
    setSearchParams({
      name: "",
      district_id: null,
      category_id: null,
      season_id: null,
      day_of_week: "",
      opening_time: "",
      closing_time: "",
    });
    setPlaces([]);
    setTouristPlaces([]);
    setAccommodations([]);
    setRestaurants([]);
    setSouvenirShops([]);
    setSelectedCriteria("");
    setSearchIconVisible(true); 
    setShowCategoryFilter(false); // รีเซ็ตไปค่าเริ่มต้น
    setShowSeasonFilter(false);
    setShowTimeFilter(false);
    setShowDistrictFilter(false);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          try {
            const nearbyPlaces = await fetchPlacesNearbyByCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );
            setPlaces(nearbyPlaces);
            categorizePlaces(nearbyPlaces);
          } catch (error) {
            console.error("Error fetching nearby places:", error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
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

  return (
    <div className="container mx-auto p-4 relative">
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-full max-w-md mx-auto flex items-center justify-center">
          <div className="relative w-full max-w-md mx-4">
            <button
              onClick={handleUseCurrentLocation}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500"
              title="ค้นหาจากพิกัดปัจจุบัน"
            >
              <FaLocationArrow size={20} />
            </button>
            <FaSearch
              className={`absolute left-10 top-1/2 transform -translate-y-1/2 text-orange-500 ${
                !searchIconVisible ? "hidden" : ""
              }`}
            />
            <input
              type="text"
              placeholder="ค้นหาชื่อสถานที่"
              className="p-2 pl-14 border border-orange-500 rounded w-full focus:outline-none focus:border-orange-600"
              value={searchParams.name}
              onChange={(e) => handleSearchChange("name", e.target.value)}
            />
            {!searchIconVisible && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500"
              >
                <FaTimesCircle size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toggle filters */}
      <div className="flex justify-center mb-4 flex-wrap gap-2">
        <button
          onClick={() => setShowCategoryFilter(!showCategoryFilter)}
          className="border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center"
        >
          <FaLayerGroup className="mr-2" /> เลือกประเภทสถานที่
        </button>
        <button
          onClick={() => setShowSeasonFilter(!showSeasonFilter)}
          className="border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center"
        >
          <FaLeaf className="mr-2" /> เลือกสถานที่ตามฤดูกาล
        </button>
        <button
          onClick={() => setShowTimeFilter(!showTimeFilter)}  // Show or hide time filter
          className="border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center"
        >
          <FaClock className="mr-2" /> เลือกตามวันและเวลา
        </button>
        <button
          onClick={() => setShowDistrictFilter(!showDistrictFilter)}
          className="border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center"
        >
          <FaLocationArrow className="mr-2" /> เลือกอำเภอ
        </button>
      </div>

   {/* Category filter */}
{showCategoryFilter && (
  <div className="flex flex-wrap gap-4 justify-center mb-4">
    {categories.map((category) => {
      // Determine the icon for each category based on its ID or name
      const categoryIcon = () => {
        switch (category.id) {
          case 1:
            return <FaTree className="mr-2" />; // Icon for tourist places
          case 2:
            return <FaBed className="mr-2" />; // Icon for accommodations
          case 3:
            return <FaUtensils className="mr-2" />; // Icon for restaurants
          case 4:
            return <FaStore className="mr-2" />; // Icon for souvenir shops
          default:
            return null;
        }
      };
      return (
        <button
          key={category.id}
          onClick={() => handleSearchChange("category_id", category.id)}
          className={`border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center ${
            searchParams.category_id === category.id ? "bg-orange-500 text-white" : ""
          }`}
        >
          {categoryIcon()}
          {category.name}
        </button>
      );
    })}
  </div>
)}
      
{/* Season filter */}
{showSeasonFilter && (
  <div className="flex flex-wrap gap-4 justify-center mb-4">
    {seasons.map((season) => {
      // Determine the icon for each season based on its ID or name
      const seasonIcon = () => {
        switch (season.id) {
          case 1:
            return <FaSun className="mr-2" />; // Icon for Summer
          case 2:
            return <FaSnowflake className="mr-2" />; // Icon for Winter
          case 3:
            return <FaLeaf className="mr-2" />; // Icon for Autumn
          case 4:
            return <FaSeedling className="mr-2" />; // Icon for Spring
          default:
            return null;
        }
      };

      return (
        <button
          key={season.id}
          onClick={() => handleSearchChange("season_id", season.id)}
          className={`border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center ${
            searchParams.season_id === season.id ? "bg-orange-500 text-white" : ""
          }`}
        >
          {seasonIcon()}
          {season.name}
        </button>
      );
    })}
  </div>
)}

      {/* District filter */}
      {showDistrictFilter && (
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          {districts.map((district) => (
            <button
              key={district.id}
              onClick={() => handleSearchChange("district_id", district.id)}
              className={`border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 ${
                searchParams.district_id === district.id
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              {district.name}
            </button>
          ))}
        </div>
      )}

    {/* Time filter */}
{showTimeFilter && (
  <div className="flex flex-wrap justify-center gap-4 mb-4">
    {/* Day of week selection */}
    <div className="flex flex-col items-center">
      <label htmlFor="day_of_week" className="text-orange-500 flex items-center">
        <FaClock className="mr-2" /> เลือกวัน:
      </label>
      <select
        id="day_of_week"
        value={searchParams.day_of_week || ""}
        onChange={(e) => handleSearchChange("day_of_week", e.target.value)}
        className="border border-orange-500 rounded p-2 flex items-center"
      >
        <option value="">วัน</option>
        <option value="Sunday">วันอาทิตย์</option>
        <option value="Monday">วันจันทร์</option>
        <option value="Tuesday">วันอังคาร</option>
        <option value="Wednesday">วันพุธ</option>
        <option value="Thursday">วันพฤหัสบดี</option>
        <option value="Friday">วันศุกร์</option>
        <option value="Saturday">วันเสาร์</option>
      </select>
    </div>

    {/* Opening time selection */}
    <div className="flex flex-col items-center">
      <label htmlFor="opening_time" className="text-orange-500 flex items-center">
        <FaClock className="mr-2" /> เวลาเปิด:
      </label>
      <div className="relative">
        <input
          type="time"
          id="opening_time"
          value={searchParams.opening_time || ""}
          onChange={(e) => handleSearchChange("opening_time", e.target.value)}
          className="border border-orange-500 rounded p-2 pl-10"
        />
        <FaClock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
    </div>

    {/* Closing time selection */}
    <div className="flex flex-col items-center">
      <label htmlFor="closing_time" className="text-orange-500 flex items-center">
        <FaClock className="mr-2" /> เวลาปิด:
      </label>
      <div className="relative">
        <input
          type="time"
          id="closing_time"
          value={searchParams.closing_time || ""}
          onChange={(e) => handleSearchChange("closing_time", e.target.value)}
          className="border border-orange-500 rounded p-2 pl-10"
        />
        <FaClock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  </div>
)}


      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <FallingLines width="100" color="#4fa94d" visible={true} />
        </div>
      )}

      <div className="mt-4">
        {places.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              ผลลัพธ์การค้นหา ({places.length} สถานที่)
            </h2>
            <Slider {...settings}>
              {places.map((place) => (
                <Link href={`/place/${place.id}`} key={place.id}>
                  <div className="p-4 cursor-pointer">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                      <Image
                        src={
                          place.images && place.images[0]?.image_url
                            ? place.images[0].image_url
                            : "/default-image.jpg"
                        }
                        alt={place.name}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {place.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {place.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        ) : (
          <p className="text-lg font-bold text-center text-orange-500 mb-4">ไม่พบสถานที่!</p>
        )}

        {/* Display categorized places */}
        {touristPlaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              สถานที่ท่องเที่ยว ({touristPlaces.length})
            </h2>
            <Slider {...settings}>
              {touristPlaces.map((place) => (
                <Link href={`/place/${place.id}`} key={place.id}>
                  <div className="p-4 cursor-pointer">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
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
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        )}

        {accommodations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              ที่พัก ({accommodations.length})
            </h2>
            <Slider {...settings}>
              {accommodations.map((place) => (
                <Link href={`/place/${place.id}`} key={place.id}>
                  <div className="p-4 cursor-pointer">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
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
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        )}

        {restaurants.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              ร้านอาหาร ({restaurants.length})
            </h2>
            <Slider {...settings}>
              {restaurants.map((place) => (
                <Link href={`/place/${place.id}`} key={place.id}>
                  <div className="p-4 cursor-pointer">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
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
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        )}

        {souvenirShops.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              ร้านค้าของฝาก ({souvenirShops.length})
            </h2>
            <Slider {...settings}>
              {souvenirShops.map((place) => (
                <Link href={`/place/${place.id}`} key={place.id}>
                  <div className="p-4 cursor-pointer">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
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
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristSearchComponent;
