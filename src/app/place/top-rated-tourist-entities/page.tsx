"use client";

import React, { useEffect, useState } from "react";
import { Place } from "@/models/interface";
import {
  getTopRatedTouristEntities,
  fetchTopRatedTouristAttractions,
  fetchTopRatedAccommodations,
  fetchTopRatedRestaurants,
  fetchTopRatedSouvenirShops,
} from "@/services/user/api";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const PAGE_SIZE = 6;

// Helper function to render star icons based on rating
const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (i - rating < 1) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-500" />);
    }
  }
  return stars;
};

// Function to get image URL
const getImageUrl = (imagePath: string) => {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath}`;
};

const TopRatedPlacesPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("tourist-attractions");

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      let response: Place[] = [];

      try {
        switch (category) {
          case "tourist-entities":
            response = await getTopRatedTouristEntities();
            break;
          case "tourist-attractions":
            response = await fetchTopRatedTouristAttractions();
            break;
          case "accommodations":
            response = await fetchTopRatedAccommodations();
            break;
          case "restaurants":
            response = await fetchTopRatedRestaurants();
            break;
          case "souvenir-shops":
            response = await fetchTopRatedSouvenirShops();
            break;
          default:
            break;
        }

        setPlaces(response.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
        setTotalPages(Math.ceil(response.length / PAGE_SIZE));
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [category, currentPage]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">สถานที่ท่องเที่ยวแนะนำ</h1>

      {/* Category Selector */}
      <div className="flex justify-center mb-6">
        {["tourist-entities", "tourist-attractions", "accommodations", "restaurants", "souvenir-shops"].map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 mx-2 rounded ${
              category === cat ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat === "tourist-entities" && "ทั้งหมด"}
            {cat === "tourist-attractions" && "สถานที่ท่องเที่ยว"}
            {cat === "accommodations" && "ที่พัก"}
            {cat === "restaurants" && "ร้านอาหาร"}
            {cat === "souvenir-shops" && "ร้านค้าของฝาก"}
          </button>
        ))}
      </div>

      {/* Places Grid */}
      {loading ? (
        <div className="text-center">กำลังโหลด...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <Link href={`/place/${place.id}`} key={place.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                {place.images && place.images.length > 0 ? (
                  <Image
                    src={getImageUrl(place.images[0].image_path)}
                    alt={place.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{place.name}</h3>
                    <p className="text-gray-600">{place.description}</p>
                    <p className="text-gray-600 mt-2"><strong>อำเภอ:</strong> {place.district_name}</p>
                  </div>
                  {/* Rating display */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {typeof place.average_rating === "number"
                        ? renderStars(place.average_rating)
                        : <span className="text-gray-500">N/A</span>}
                    </div>
                    <span className="text-gray-600 ml-2">
                      {typeof place.average_rating === "number"
                        ? place.average_rating.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

// Pagination Component
const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600 transform hover:scale-105 transition duration-300 ease-in-out"
      >
        ก่อนหน้า
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-3 py-2 rounded-lg transform transition duration-300 ease-in-out ${
            page === currentPage
              ? 'bg-orange-700 text-white hover:shadow-xl hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-800'
              : 'bg-orange-500 text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600'
          } hover:scale-105`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 px-3 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600 transform hover:scale-105 transition duration-300 ease-in-out"
      >
        ถัดไป
      </button>
    </div>
  );
};

export default TopRatedPlacesPage;
