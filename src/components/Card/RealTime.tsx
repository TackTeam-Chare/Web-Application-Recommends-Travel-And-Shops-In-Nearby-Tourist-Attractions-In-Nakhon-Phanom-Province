"use client";

import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { fetchRealTimeTouristAttractions } from "@/services/user/api";
import Image from "next/image";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const RealTimeSeasonalAttractions = () => {
  const [attractions, setAttractions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const data = await fetchRealTimeTouristAttractions();
        setAttractions(data);
      } catch (error) {
        console.error("Error fetching real-time tourist attractions:", error);
      }
    };

    fetchAttractions();
  }, []);

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">สถานที่ท่องเที่ยวตามฤดูกาลปัจจุบัน</h1>
      {attractions.length > 0 ? (
        <Carousel responsive={responsive} className="z-10">
          {attractions.map((attraction, index) => (
            <div key={index} className="p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {attraction.images && attraction.images.length > 0 ? (
                  <Image
                    src={attraction.images[0].image_url}
                    alt={attraction.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{attraction.name}</h3>
                  <p className="text-gray-600">{attraction.description}</p>
                  <p className="text-gray-600"><strong>อำเภอ:</strong> {attraction.district_name}</p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <p className="text-gray-600">ไม่มีสถานที่ท่องเที่ยวตามฤดูกาลในขณะนี้</p>
      )}
    </div>
  );
};

export default RealTimeSeasonalAttractions;
