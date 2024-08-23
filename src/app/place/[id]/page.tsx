"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { getNearbyFetchTourismData } from "@/services/user/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GoogleMapComponent from "@/components/MapAPI/GoogleMap";

const removeDuplicateImages = (images: any[]) => {
  const uniqueImages = new Map();
  images.forEach((image) => {
    if (!uniqueImages.has(image.image_url)) {
      uniqueImages.set(image.image_url, image);
    }
  });
  return Array.from(uniqueImages.values());
};

const PlaceNearbyPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [tourismData, setTourismData] = useState<any>(null);
  const [nearbyEntities, setNearbyEntities] = useState<any[]>([]);

  useEffect(() => {
    const fetchTourismData = async () => {
      if (id) {
        try {
          const data = await getNearbyFetchTourismData(Number(id));
          if (data.entity && data.entity.images) {
            data.entity.images = removeDuplicateImages(data.entity.images);
          }
          if (data.nearbyEntities) {
            data.nearbyEntities = data.nearbyEntities.map((entity) => {
              if (entity.images) {
                entity.images = removeDuplicateImages(entity.images);
              }
              return entity;
            });
          }
          setTourismData(data.entity);
          setNearbyEntities(data.nearbyEntities);
        } catch (error) {
          console.error("Error fetching tourism data:", error);
        }
      }
    };

    fetchTourismData();
  }, [id]);

  if (!tourismData) {
    return <div>Loading...</div>;
  }

  const isValidCoordinates = !isNaN(Number(tourismData.latitude)) && !isNaN(Number(tourismData.longitude));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "สถานที่ท่องเที่ยว":
        return "bg-orange-500";
      case "ที่พัก":
        return "bg-blue-500";
      case "ร้านอาหาร":
        return "bg-green-500";
      case "ร้านค้าของฝาก":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={`container mx-auto mt-10 px-4 flex ${nearbyEntities.length > 0 ? "flex-col lg:flex-row" : "flex-col"} gap-8`}>
      <div className={nearbyEntities.length > 0 ? "w-full lg:w-2/3" : "w-full"}>
        <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-Orange-500 text-center mt-10 mb-5">
         {tourismData.name}
        </h1>
        <Slider {...settings}>
          {Array.isArray(tourismData.images) && tourismData.images.length > 0 ? (
            tourismData.images.map((image: any, index: number) => (
              <div key={index}>
                <Image
                  src={image.image_url}
                  alt={`Slide ${index + 1}`}
                  width={1200}
                  height={800}
                  className="rounded-lg shadow-lg object-cover w-full h-[40vh] lg:h-[60vh]"
                  priority
                  quality={100}
                />
              </div>
            ))
          ) : (
            <div className="w-full h-[40vh] lg:h-[60vh] flex items-center justify-center bg-gray-200 rounded-lg shadow-lg">
              <p className="text-gray-500">ไม่มีรูปภาพ</p>
            </div>
          )}
        </Slider>
        <div className="mt-8 mb-10">
          <h1 className="text-4xl font-bold text-gray-800">{tourismData.name}</h1>
          <p className="text-gray-600 mt-4">
            <strong>เกี่ยวกับ:</strong> {tourismData.description}
          </p>
          <p className="text-gray-600 mt-2">
            <strong>ที่อยู่:</strong> {tourismData.location}
          </p>
          <p className="text-gray-600 mt-2">
            <strong>หมวดหมู่:</strong> {tourismData.category_name}
          </p>
          <p className="text-gray-600 mt-2">
            <strong>อำเภอ:</strong> {tourismData.district_name}
          </p>
        </div>
        {isValidCoordinates && (
          <GoogleMapComponent
            lat={Number(tourismData.latitude)}
            lng={Number(tourismData.longitude)}
            nearbyEntities={nearbyEntities}
          />
        )}
      </div>

      {nearbyEntities.length > 0 && (
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-gray-800">สถานที่ใกล้เคียง</h1>
          {nearbyEntities.map((entity: any) => (
            <Link key={entity.id} href={`/place/${entity.id}`} className="block">
              <div className={`bg-white p-4 rounded-lg shadow-lg flex flex-col items-start relative hover:shadow-2xl transition-shadow duration-300 ease-in-out`}>
                <div className={`absolute top-0 right-0 mt-2 mr-2 ${getCategoryColor(entity.category_name)} text-white text-xs font-semibold px-2 py-1 rounded`}>
                  {entity.category_name}
                </div>
                {Array.isArray(entity.images) && entity.images.length > 0 ? (
                  <Image
                    src={entity.images[0].image_url}
                    alt={entity.name}
                    width={500}
                    height={300}
                    className="w-full h-auto rounded-lg shadow-md"
                    quality={100}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2 hover:text-orange-500 transition-colors duration-300 ease-in-out">
                  {entity.name}
                </h3>
                <p className="text-gray-700 mb-1"><strong>หมวดหมู่:</strong> {entity.category_name}</p>
                <p className="text-gray-700 mb-1"><strong>เขต:</strong> {entity.district_name}</p>
                <p className="text-gray-700 mb-1"><strong>ระยะทาง:</strong> {entity.distance} เมตร</p>
                <p className="text-gray-700 mb-1"><strong>เวลาทำการ:</strong> {entity.opening_times} - {entity.closing_times}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceNearbyPage;
