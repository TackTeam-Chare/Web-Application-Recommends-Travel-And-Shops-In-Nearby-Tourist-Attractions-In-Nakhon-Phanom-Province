"use client";
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Place } from '@/models/interface';
import { fetchRandomTouristAttractions } from '@/services/user/api';
import Image from 'next/image';

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
              <a href={place.link} target="_blank" rel="noopener noreferrer">
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
              </a>
            </div>
            <div className="flex-1 flex flex-col justify-between p-6">
              <h3 className="entry-title text-3xl font-bold mb-4">
                <a href={place.link} target="_blank" rel="noopener noreferrer">
                  {place.name}
                </a>
              </h3>
              <div className="line-divided line-divided-yellow mb-4"></div>
              <p className="flex-grow">{place.description}</p>
              <a href={place.link} target="_blank" className="text-orange-500 hover:text-orange-600 font-semibold mt-auto">
                อ่านต่อ →
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CardRandom;
