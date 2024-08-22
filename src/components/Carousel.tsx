"use client";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
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

  const slides = [
    {
      id: 1,
      title: "Amazing Thailand",
      subtitle: "Phu Phra Bat Historical Park, Udon Thani",
      description: "Thailand's Fifth Cultural Heritage Site. อุทยานประวัติศาสตร์ภูพระบาท จ. อุดรธานี มรดกโลกทางวัฒนธรรมแห่งที่ 5 ของประเทศไทย",
      imageUrl: "https://cms.dmpcdn.com/travel/2022/07/10/6fbc4090-002d-11ed-aa6d-6bfb6ee4de9a_webp_original.jpg",
    },
    {
      id: 2,
      title: "Another Destination",
      subtitle: "Beautiful Beaches",
      description: "Experience the most beautiful beaches in Thailand.",
      imageUrl: "https://www.thaitravelcenter.com/webdatas/travelinfo/content/Nakhon-panom-1-day-trip/1.jpg",
    },
  ];

  return (
    <div className="w-full">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              layout="fill"
              objectFit="cover"
              quality={100}
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-start p-8 md:p-16 lg:p-24">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-yellow-400">{slide.title}</h2>
              <h3 className="text-lg md:text-xl lg:text-2xl text-white mt-2">{slide.subtitle}</h3>
              <p className="text-md md:text-lg lg:text-xl text-white mt-4 max-w-3xl">{slide.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
