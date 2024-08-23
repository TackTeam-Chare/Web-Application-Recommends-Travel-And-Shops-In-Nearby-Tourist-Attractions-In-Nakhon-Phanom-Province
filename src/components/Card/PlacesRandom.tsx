"use client";
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Place } from '@/models/interface';
import { fetchRandomTouristAttractions } from '@/services/user/api';
import Image from 'next/image';
import Link from 'next/link';

const CardRandom = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const data = await fetchRandomTouristAttractions();
        setPlaces(data);
      } catch (error) {
        console.error('Error fetching random tourist attractions:', error);
      }
    };

    getPlaces();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-4xl font-bold text-center mb-6">สถานที่เเบบสุ่ม</h2>
      <Slider {...settings}>
        {places.map((place) => (
          <div key={place.id} className="flex items-center">
            <div className="flex-1">
              <Link href={`/place/${place.id}`}>
                {place.image_url && typeof place.image_url === 'string' ? (
                  <Image
                    src={place.image_url}
                    alt={place.name}
                    width={500}
                    height={350}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                    className="rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">ไม่มีรูปภาพสถานที่</span>
                  </div>
                )}
              </Link>
            </div>
            <div className="flex-1 flex flex-col justify-between p-6">
              <h3 className="entry-title text-3xl font-bold mb-4">
                <Link href={`/place/${place.id}`}>
                  {place.name}
                </Link>
              </h3>
              <p className="flex-grow"><strong>หมวดหมู่:</strong> {place.category_name}</p>
              <p className="flex-grow"><strong>อำเภอ:</strong> {place.district_name}</p>
              <p className="flex-grow">{place.description}</p>
              <Link href={`/place/${place.id}`} className="text-orange-500 hover:text-orange-600 font-semibold mt-auto">
                อ่านต่อ →
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CardRandom;
