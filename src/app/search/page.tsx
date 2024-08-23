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
} from "@/services/user/api";
import Image from "next/image";
import Link from "next/link";
import { Category, District, Season, Place } from "@/models/interface";

interface TimeFilter {
  day_of_week: string;
  opening_time: string;
  closing_time: string;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
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
  };

  useEffect(() => {
    handleSearch();
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
    handleSearch(); // Search immediately after setting the filter
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">ค้นหาสถานที่</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-orange-300"
          placeholder="ค้นหาสถานที่ท่องเที่ยว ร้านค้าของฝาก ที่พัก ร้านอาหาร..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch();
          }}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="p-3 rounded-lg border border-gray-300 focus:ring focus:ring-orange-300"
          value={selectedCategory || ""}
          onChange={(e) => handleFilterChange("category", Number(e.target.value) || null)}
        >
          <option value="">เลือกหมวดหมู่สถานที่</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className="p-3 rounded-lg border border-gray-300 focus:ring focus:ring-orange-300"
          value={selectedDistrict || ""}
          onChange={(e) => handleFilterChange("district", Number(e.target.value) || null)}
        >
          <option value="">เลือกอำเภอ</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>

        <select
          className="p-3 rounded-lg border border-gray-300 focus:ring focus:ring-orange-300"
          value={selectedSeason || ""}
          onChange={(e) => handleFilterChange("season", Number(e.target.value) || null)}
        >
          <option value="">เลือกฤดูกาล</option>
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      {/* Time Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="p-3 rounded-lg border border-gray-300 focus:ring focus:ring-orange-300"
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
          className="p-3 rounded-lg border border-gray-300 focus:ring focus:ring-orange-300"
          placeholder="เวลาเปิด"
          value={timeFilter.opening_time}
          onChange={(e) => handleFilterChange("time", { opening_time: e.target.value })}
        />

        <input
          type="time"
          className="p-3 rounded-lg border border-gray-300 focus:ring focus:ring-orange-300"
          placeholder="เวลาปิด"
          value={timeFilter.closing_time}
          onChange={(e) => handleFilterChange("time", { closing_time: e.target.value })}
        />
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-700">
          {results.length > 0
            ? `พบ ${results.length} ผลลัพธ์`
            : hasSearched
            ? "ไม่พบผลลัพธ์การค้นหา"
            : "ค้นหาสถานที่ที่คุณต้องการเลย!"}
        </p>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
        >
          ล้างการค้นหา
        </button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((place) => (
          <Link key={place.id} href={`/place/${place.id}`}>
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 ease-in-out h-full flex flex-col justify-between">
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
              <h2 className="text-xl font-semibold">{place.name}</h2>
              <p className="text-gray-600 flex-grow">{place.description}</p>
              <p className="text-orange-500 mt-2 font-bold self-end">อ่านต่อ...</p>
            </div>
          </Link>
        ))}
      </div>

      {!hasSearched && results.length === 0 && (
        <div className="text-center text-gray-600 mt-10">
          ค้นหาสถานที่ที่คุณต้องการเลย!
        </div>
      )}

      {hasSearched && results.length === 0 && (
        <div className="text-center text-gray-600 mt-10">
          ไม่พบผลลัพธ์การค้นหา
        </div>
      )}
    </div>
  );
};

export default SearchPage;
