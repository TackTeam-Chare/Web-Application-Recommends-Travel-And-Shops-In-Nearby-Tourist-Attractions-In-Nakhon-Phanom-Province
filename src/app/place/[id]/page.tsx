"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from "@react-google-maps/api";
import { getNearbyFetchTourismData } from "@/services/user/api";
import Swal from "sweetalert2"; // Import SweetAlert2 for alerts
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Ensure TypeScript knows about google.maps types
declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const removeDuplicateImages = (images: any[]) => {
  const uniqueImages = new Map();
  images.forEach((image) => {
    if (!uniqueImages.has(image.image_url)) {
      uniqueImages.set(image.image_url, image);
    }
  });
  return Array.from(uniqueImages.values());
};

// Function to map place types to their corresponding icons
const getIconForPlaceType = (type: string) => {
  switch (type) {
    case "amusement_park":
      return "http://maps.google.com/mapfiles/kml/pal2/icon5.png";
    case "aquarium":
      return "http://maps.google.com/mapfiles/kml/pal2/icon13.png";
    case "art_gallery":
      return "http://maps.google.com/mapfiles/kml/pal3/icon21.png";
    case "atm":
      return "http://maps.google.com/mapfiles/kml/pal2/icon56.png";
    case "bar":
      return "http://maps.google.com/mapfiles/kml/pal2/icon49.png";
    case "bus_station":
      return "http://maps.google.com/mapfiles/kml/pal3/icon33.png";
    case "cafe":
      return "http://maps.google.com/mapfiles/kml/pal2/icon23.png";
    case "campground":
      return "http://maps.google.com/mapfiles/kml/pal4/icon7.png";
    case "church":
      return "http://maps.google.com/mapfiles/kml/pal3/icon38.png";
    case "clothing_store":
      return "http://maps.google.com/mapfiles/kml/pal4/icon15.png";
    case "convenience_store":
      return "http://maps.google.com/mapfiles/kml/pal3/icon20.png";
    case "department_store":
      return "http://maps.google.com/mapfiles/kml/pal4/icon19.png";
    case "florist":
      return "http://maps.google.com/mapfiles/kml/pal2/icon58.png";
    case "gas_station":
      return "http://maps.google.com/mapfiles/kml/pal4/icon14.png";
    case "lodging":
      return "http://maps.google.com/mapfiles/kml/pal2/icon63.png";
    case "movie_theater":
      return "http://maps.google.com/mapfiles/kml/pal4/icon34.png";
    case "museum":
      return "http://maps.google.com/mapfiles/kml/pal3/icon45.png";
    case "park":
      return "http://maps.google.com/mapfiles/kml/pal2/icon6.png";
    case "parking":
      return "http://maps.google.com/mapfiles/kml/pal2/icon15.png";
    case "restaurant":
      return "http://maps.google.com/mapfiles/kml/pal3/icon56.png";
    case "shopping_mall":
      return "http://maps.google.com/mapfiles/kml/pal4/icon12.png";
    case "spa":
      return "http://maps.google.com/mapfiles/kml/pal3/icon27.png";
    case "store":
      return "http://maps.google.com/mapfiles/kml/pal3/icon10.png";
    case "subway_station":
      return "http://maps.google.com/mapfiles/kml/pal3/icon34.png";
    case "supermarket":
      return "http://maps.google.com/mapfiles/kml/pal2/icon45.png";
    case "tourist_attraction":
      return "http://maps.google.com/mapfiles/kml/pal2/icon39.png";
    case "train_station":
      return "http://maps.google.com/mapfiles/kml/pal4/icon33.png";
    case "zoo":
      return "http://maps.google.com/mapfiles/kml/pal2/icon31.png";
    default:
      return "http://maps.google.com/mapfiles/kml/pal2/icon5.png";
  }
};

const PlaceNearbyPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [tourismData, setTourismData] = useState<any>(null);
  const [nearbyEntities, setNearbyEntities] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any>(null); // State for selected marker

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

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

          // Show alert if no nearby places found
          if (!data.nearbyEntities || data.nearbyEntities.length === 0) {
            Swal.fire("No Nearby Places", "ไม่พบสถานที่ใกล้เคียง", "info");
          }
        } catch (error) {
          console.error("Error fetching tourism data:", error);
          Swal.fire("Error", "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง", "error");
        }
      }
    };

    fetchTourismData();
  }, [id]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

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

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const center = {
    lat: Number(tourismData.latitude),
    lng: Number(tourismData.longitude),
  };

  return (
    <div className={`container mx-auto mt-10 px-4 flex ${nearbyEntities.length > 0 ? "flex-col lg:flex-row" : "flex-col"} gap-8`}>
      <div className={nearbyEntities.length > 0 ? "w-full lg:w-2/3" : "w-full"}>
        <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 text-center mt-10 mb-5">
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
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={14}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              styles: [],
            }}
            onLoad={onMapLoad}
          >
            {/* Main Place Marker with distinct icon */}
            <MarkerF 
              position={center} 
              title={tourismData.name} 
              icon={{
                url: "http://maps.google.com/mapfiles/kml/pal2/icon56.png", // Main place icon
                scaledSize: new window.google.maps.Size(50, 50),
              }}
              onClick={() => setSelectedEntity(tourismData)}
            />

            {/* Markers for Nearby Places */}
            {nearbyEntities.map((entity: any) => (
              <MarkerF
                key={entity.id}
                position={{ lat: Number(entity.latitude), lng: Number(entity.longitude) }}
                title={entity.name}
                icon={{
                  url: getIconForPlaceType(entity.category_name),
                  scaledSize: new window.google.maps.Size(40, 40), // Adjust size as needed
                }}
                onClick={() => setSelectedEntity(entity)}
              />
            ))}

            {/* InfoWindow for Selected Place */}
            {selectedEntity && (
              <InfoWindowF
                position={{ lat: Number(selectedEntity.latitude), lng: Number(selectedEntity.longitude) }}
                onCloseClick={() => setSelectedEntity(null)}
              >
                <div className="p-2">
                  <h3 className="text-lg font-bold">{selectedEntity.name}</h3>
                  {selectedEntity.images && selectedEntity.images[0] && (
                    <Image
                      src={selectedEntity.images[0].image_url}
                      alt={selectedEntity.name}
                      width={100}
                      height={75}
                      className="rounded-lg mb-2"
                    />
                  )}
                  <p className="text-gray-600">{selectedEntity.district_name}</p>
                  <p className="text-gray-600">{selectedEntity.distance?.toFixed(2) || 0} กม. จากคุณ</p>
                  {selectedEntity.season_name && (
                    <p className="text-gray-600">ฤดูกาล: {selectedEntity.season_name}</p>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEntity.latitude},${selectedEntity.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    เปิดใน Google Maps
                  </a>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
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
