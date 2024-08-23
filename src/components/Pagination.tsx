"use client";

import { useEffect, useState } from "react";
import PlaceCard from "@/components/Card/Places/Places";
import { fetchTouristAttractions, fetchAccommodations, fetchRestaurants, fetchSouvenirShops } from "@/services/user/api";
import { Place } from "@/models/interface";

const PAGE_SIZE = 6;

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("tourist-attractions");

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      let response: Place[] = [];

      switch (category) {
        case "tourist-attractions":
          response = await fetchTouristAttractions();
          break;
        case "accommodations":
          response = await fetchAccommodations();
          break;
        case "restaurants":
          response = await fetchRestaurants();
          break;
        case "souvenir-shops":
          response = await fetchSouvenirShops();
          break;
        default:
          break;
      }

      setPlaces(response.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
      setTotalPages(Math.ceil(response.length / PAGE_SIZE));
      setLoading(false);
    };

    loadPlaces();
  }, [category, currentPage]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">สถานที่ต่างๆ ในจังหวัด</h1>

      {/* Category Selector */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mx-2 rounded ${category === "tourist-attractions" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => handleCategoryChange("tourist-attractions")}
        >
          สถานที่ท่องเที่ยว
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${category === "accommodations" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => handleCategoryChange("accommodations")}
        >
          ที่พัก
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${category === "restaurants" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => handleCategoryChange("restaurants")}
        >
          ร้านอาหาร
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${category === "souvenir-shops" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => handleCategoryChange("souvenir-shops")}
        >
          ร้านค้าของฝาก
        </button>
      </div>

      {/* Places Grid */}
      {loading ? (
        <div className="text-center">กำลังโหลด...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-2 rounded ${index + 1 === currentPage ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
