"use client";

import React, { useEffect, useState } from "react";
import { fetchRealTimeTouristAttractions } from "@/services/user/api";
import Image from "next/image";
import Link from "next/link";
import { PaginationProps } from "@/models/interface";

const RealTimeSeasonalAttractions = () => {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const data = await fetchRealTimeTouristAttractions();
        setAttractions(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching real-time tourist attractions:", error);
      }
    };

    fetchAttractions();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedAttractions = attractions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 text-center mt-10 mb-5">
        สถานที่ท่องเที่ยวตามฤดูกาลปัจจุบัน
      </h1>
      {paginatedAttractions.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAttractions.map((attraction, index) => (
              <Link
                key={index}
                href={`/place/${attraction.id}`}
                className="p-4 block"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                  {attraction.images && attraction.images.length > 0 ? (
                    <Image
                      src={attraction.images[0].image_url}
                      alt={attraction.name}
                      width={500}
                      height={300}
                      className="rounded-lg mb-4 object-cover w-full h-48"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                      <span className="text-gray-500">ไม่มีรูปภาพ</span>
                    </div>
                  )}
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold">{attraction.name}</h3>
                    <p className="text-gray-600 flex-grow overflow-hidden text-ellipsis">
                      {attraction.description}
                    </p>
                    <p className="text-gray-600">
                      <strong>อำเภอ:</strong> {attraction.district_name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-8">
          ไม่มีสถานที่ท่องเที่ยวตามฤดูกาลในขณะนี้
        </p>
      )}
    </div>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
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
              ? "bg-orange-700 text-white hover:shadow-xl hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-800"
              : "bg-orange-500 text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600"
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

export default RealTimeSeasonalAttractions;
