"use client";

import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  fetchDistricts,
  fetchSeasons,
  searchPlaces,
  searchByCategory,
  searchByDistrict,
  searchBySeason,
  searchByTime,
} from "@/services/user/api"; // Adjust the path based on your project structure
import Image from "next/image";
import Link from "next/link";
import { Category, District, Season, Place } from "@/models/interface";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { useSearchParams } from "next/navigation";

interface TimeFilter {
  day_of_week: string;
  opening_time: string;
  closing_time: string;
}

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || ""; // Get the search query from the URL

  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [results, setResults] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>({
    day_of_week: "",
    opening_time: "",
    closing_time: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    const loadFilters = async () => {
      const categoriesData = await fetchCategories();
      const districtsData = await fetchDistricts();
      const seasonsData = await fetchSeasons();
      setCategories(categoriesData);
      setDistricts(districtsData);
      setSeasons(seasonsData);
    };

    loadFilters();
  }, []);

  const handleSearch = async () => {
    setHasSearched(true);
    setLoading(true);
    let searchResults: Place[] = [];

    if (searchQuery) {
      searchResults = await searchPlaces(searchQuery);
    } else if (selectedCategory) {
      searchResults = await searchByCategory(selectedCategory);
    } else if (selectedDistrict) {
      searchResults = await searchByDistrict(selectedDistrict);
    } else if (selectedSeason) {
      searchResults = await searchBySeason(selectedSeason);
    } else if (timeFilter.day_of_week || timeFilter.opening_time || timeFilter.closing_time) {
      searchResults = await searchByTime(
        timeFilter.day_of_week,
        timeFilter.opening_time,
        timeFilter.closing_time
      );
    }

    setResults(searchResults);
    setLoading(false);
  };

  useEffect(() => {
    if (
      searchQuery ||
      selectedCategory ||
      selectedDistrict ||
      selectedSeason ||
      timeFilter.day_of_week ||
      timeFilter.opening_time ||
      timeFilter.closing_time
    ) {
      handleSearch();
    }
  }, [searchQuery, selectedCategory, selectedDistrict, selectedSeason, timeFilter]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedDistrict(null);
    setSelectedSeason(null);
    setTimeFilter({ day_of_week: "", opening_time: "", closing_time: "" });
    setResults([]);
    setHasSearched(false);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    if (filterType === "category") {
      setSelectedCategory(value);
      setSelectedDistrict(null);
      setSelectedSeason(null);
    } else if (filterType === "district") {
      setSelectedDistrict(value);
      setSelectedCategory(null);
      setSelectedSeason(null);
    } else if (filterType === "season") {
      setSelectedSeason(value);
      setSelectedCategory(null);
      setSelectedDistrict(null);
    } else if (filterType === "time") {
      setTimeFilter((prevState) => ({ ...prevState, ...value }));
    }
    handleSearch();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-bold text-orange-600 text-center mt-10 mb-5">
        ค้นหาสถานที่
      </h2>
      <p className="text-center text-gray-700 mb-6">
        สถานที่ท่องเที่ยวใกล้เคียง ที่พัก ร้านอาหาร ร้านของฝาก จังหวัดนครพนม
      </p>

      {/* Search Input */}
      <div className="relative w-full max-w-md mb-6 mx-auto">
        <input
          type="text"
          placeholder=" "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="peer w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-600"
        />
        <label
          htmlFor="search-input"
          className="absolute left-3 top-3 text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-focus:top-[-10px] peer-focus:left-2 peer-focus:text-sm peer-focus:text-orange-600 bg-white px-1"
        >
          ค้นหาสถานที่ท่องเที่ยว ร้านค้าของฝาก ที่พัก ร้านอาหาร...
        </label>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Day and Time Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6 justify-center">
        <div className="flex flex-col">
          <label htmlFor="day-select" className="text-sm font-semibold mb-1 text-orange-600">
            เลือกวันและเวลาเปิดปิดสถานที่
          </label>
          <div className="flex gap-4">
            <select
              id="day-select"
              className="p-2 w-32 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-600"
              value={timeFilter.day_of_week}
              onChange={(e) => handleFilterChange("time", { day_of_week: e.target.value })}
            >
              <option value="">เลือกวัน</option>
              <option value="Monday">จันทร์</option>
              <option value="Tuesday">อังคาร</option>
              <option value="Wednesday">พุธ</option>
              <option value="Thursday">พฤหัสบดี</option>
              <option value="Friday">ศุกร์</option>
              <option value="Saturday">เสาร์</option>
              <option value="Sunday">อาทิตย์</option>
            </select>
            <input
              type="time"
              id="opening-time"
              className="w-32 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-600"
              value={timeFilter.opening_time}
              onChange={(e) => handleFilterChange("time", { opening_time: e.target.value })}
            />
            <input
              type="time"
              id="closing-time"
              className="w-32 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-600"
              value={timeFilter.closing_time}
              onChange={(e) => handleFilterChange("time", { closing_time: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Tag Buttons for Districts, Categories, and Seasons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {districts.map((district) => (
          <button
            key={district.id}
            onClick={() => setSelectedDistrict(district.id)}
            className={`py-2 px-4 rounded-full hover:bg-orange-300 transition duration-200 ${
              selectedDistrict === district.id ? 'bg-orange-600 text-white' : 'bg-orange-200 text-orange-800'
            }`}
          >
            {district.name}
          </button>
        ))}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`py-2 px-4 rounded-full hover:bg-orange-300 transition duration-200 ${
              selectedCategory === category.id ? 'bg-orange-600 text-white' : 'bg-orange-200 text-orange-800'
            }`}
          >
            {category.name}
          </button>
        ))}
        {seasons.map((season) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season.id)}
            className={`py-2 px-4 rounded-full hover:bg-orange-300 transition duration-200 ${
              selectedSeason === season.id ? 'bg-orange-600 text-white' : 'bg-orange-200 text-orange-800'
            }`}
          >
            {season.name}
          </button>
        ))}
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-700">
          {results.length > 0
            ? `พบ ${results.length} ผลลัพธ์`
            : hasSearched && results.length === 0
            ? "ไม่พบผลลัพธ์การค้นหา"
            : "ค้นหาสถานที่ที่คุณต้องการเลย!"}
        </p>
        <button
          onClick={handleReset}
          className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition duration-200"
        >
          ล้างการค้นหา
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((place) => (
            <Link key={place.id} href={`/place/${place.id}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full cursor-pointer">
                {place.image_url && place.image_url[0] ? (
                  <Image
                    src={place.image_url[0]}
                    alt={place.name}
                    width={500}
                    height={300}
                    className="rounded-lg mb-4 object-cover w-full h-48"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <h2 className="text-xl font-semibold px-4">{place.name}</h2>
                <p className="text-gray-600 px-4 flex-grow">{place.description}</p>
                <p className="text-orange-600 mt-2 font-bold self-end px-4 mb-4">อ่านต่อ...</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!hasSearched && results.length === 0 && (
        <div className="text-center text-gray-600 mt-10">
          ค้นหาสถานที่ที่คุณต้องการเลย!
        </div>
      )}
    </div>
  );
};

export default SearchPage;