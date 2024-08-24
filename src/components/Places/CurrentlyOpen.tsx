"use client";

import React, { useState, useEffect } from "react";
import { fetchCurrentlyOpenTouristEntities } from "@/services/user/api";
import { Place } from "@/models/interface";
import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";
import { showInfoAlert, showErrorAlert } from "@/lib/sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const CurrentlyOpenPlaces: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const openPlaces = await fetchCurrentlyOpenTouristEntities();
        if (openPlaces.length === 0) {
          showInfoAlert(
            "ไม่มีสถานที่เปิดในขณะนี้",
            "ขณะนี้ไม่มีสถานที่ท่องเที่ยวเปิดให้บริการ"
          );
        }
        setPlaces(openPlaces);
      } catch (error) {
        console.error("Error fetching currently open places:", error);
        showErrorAlert(
          "เกิดข้อผิดพลาด",
          "ไม่สามารถดึงข้อมูลสถานที่ได้ กรุณาลองใหม่อีกครั้ง"
        );
      }
    };

    fetchPlaces();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-orange-500 text-center mb-8">
        สถานที่ที่เปิดทำการในเวลานี้
      </h2>
      {places.length > 0 ? (
        <Slider {...settings} className="max-w-5xl mx-auto">
          {places.map((place) => (
            <div
              key={place.id}
              className="flex flex-col items-center justify-center px-4"
            >
              <Link
                href={`/place/${place.id}`}
                className="block relative w-full h-96 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
              >
                {place.image_url && place.image_url.length > 0 ? (
                  <Image
                    src={place.image_url[0]} // Display the first image
                    alt={place.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-200 rounded-lg">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                )}
              </Link>
              <div className="mt-5 w-full px-4">
                <h3 className="text-2xl font-bold text-orange-500 text-left">
                  {place.name}
                </h3>
                <p className="text-gray-600 mt-2 mb-4 text-left">
                  {place.description}
                </p>
                <p className=" mb-2 text-left">
                  <strong className="mr-2">ประเภท:</strong>
                  {place.category_name}
                </p>
                <p className="text-gray-600 text-left">
                  <strong className="mr-2">ที่ตั้ง:</strong> {place.location}
                </p>
                <div className="flex justify-end w-full mt-4">
                  <Link
                    href={`/place/${place.id}`}
                    className="text-orange-500 font-bold ฏ flex items-center"
                  >
                    อ่านเพิ่มเติม{" "}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ml-2 text-orange-500"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-xl font-bold text-orange-500">
          ไม่มีสถานที่เปิดในขณะนี้
        </p>
      )}
    </div>
  );
};

export default CurrentlyOpenPlaces;
