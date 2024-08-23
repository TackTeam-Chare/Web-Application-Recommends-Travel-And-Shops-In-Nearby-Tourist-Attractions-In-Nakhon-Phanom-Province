"use client";

import React, { useState, useEffect } from "react";
import { fetchCurrentlyOpenTouristEntities } from "@/services/user/api";
import { Place } from "@/models/interface";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";

const CurrentlyOpenPlaces: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const openPlaces = await fetchCurrentlyOpenTouristEntities();
        setPlaces(openPlaces);
      } catch (error) {
        console.error("Error fetching currently open places:", error);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="container mx-auto py-10">
  <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-Orange-500 text-center mt-10 mb-5">สถานที่ที่เปิดทำการในเวลานี้</h2>
      {places.length > 0 ? (
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={5000}
          showArrows={true}
          showStatus={false}
          dynamicHeight={false}
          className="carousel"
        >
          {places.map((place) => (
            <div key={place.id} className="h-full flex flex-col items-center justify-center">
              <Link href={`/place/${place.id}`}>
                <a className="block relative w-full h-96 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                  {place.image_url && place.image_url.length > 0 ? (
                    <Image
                      src={place.image_url[0]} // Display the first image
                      alt={place.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-300">
                      <span className="text-gray-500">ไม่มีรูปภาพ</span>
                    </div>
                  )}
                </a>
              </Link>
              <h3 className="text-2xl font-semibold mt-4">{place.name}</h3>
              <p className="text-gray-600 text-center px-4">{place.description}</p>
              <Link href={`/place/${place.id}`}>
                <a className="mt-4 text-orange-500 font-bold">อ่านต่อ...</a>
              </Link>
            </div>
          ))}
        </Carousel>
      ) : (
        <p className="text-center text-gray-600">ไม่มีสถานที่เปิดในขณะนี้</p>
      )}
    </div>
  );
};

export default CurrentlyOpenPlaces;
