"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const MainLocationPage = () => {
  // Sample images, replace these with your own images
  const images = [
    "https://static.thairath.co.th/media/dFQROr7oWzulq5Fa5BwNdKo6g2JTzOk2NPx5DpVmq3CyK5DbyHcO2DGTbxERnH3P2Ok.jpg",
    "https://www.museumthailand.com/upload/evidence/1523261578_18994.jpg",
    "https://cbtthailand.dasta.or.th/upload-file-api/Resources/RelateAttraction/Images/RAT480335/1.jpeg",
  ];

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

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Main Location Images Carousel */}
        <div className="w-full lg:w-2/3">
          <Slider {...settings}>
            {images.map((image, index) => (
              <div key={index}>
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  width={1200}
                  height={800}
                  className="rounded-lg shadow-lg object-cover w-full h-[40vh] lg:h-[60vh]"
                  priority
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Right Side - Details */}
        <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0 flex flex-col">
          <h1 className="text-4xl font-bold text-gray-800">วัดพระธาตุพนมวรมหาวิหาร</h1>
          <p className="text-gray-600 mt-4">
            วัดพระธาตุพนมวรมหาวิหาร เป็นสถานที่ศักดิ์สิทธิ์ที่สำคัญที่สุดในจังหวัดนครพนม ตั้งอยู่ในอำเภอธาตุพนม เป็นพระธาตุเก่าแก่ที่สุดแห่งหนึ่งในประเทศไทย และเป็นที่สักการะของชาวพุทธทั่วประเทศ เพื่อขอพรและเป็นสิริมงคลในการเริ่มต้นชีวิตใหม่.
          </p>
          <p className="text-gray-600 mt-2">
            ประเพณีที่สำคัญคืองานนมัสการองค์พระธาตุพนม ซึ่งจัดขึ้นในช่วงเดือนกุมภาพันธ์ของทุกปี ดึงดูดผู้คนจากทั่วประเทศมาร่วมงาน
          </p>
          <button className="mt-6 py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300">
            อ่านเพิ่มเติม
          </button>
        </div>
      </div>

      {/* Bottom Side - Map */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">แผนที่สถานที่</h2>
        <div className="w-full h-64 lg:h-96 bg-gray-200 rounded-lg shadow-lg">
          {/* Embed a map or use a map component here */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.5536292210475!2d104.73354351530953!3d17.04609448802737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3123be7e2df1711f%3A0xd5a3df8b76e4f861!2z4LiB4Lij4LiT4Li14LmJ4Lih4Lix4LiI4Lix4Lij4LmMIOC5gOC4peC4l-C5hOC5gOC4oeC4meC4suC4ouC4q-C4geC4o-C4lOC5iOC4q-C4nOC4meC4hOC5jA!5e0!3m2!1sth!2sth!4v1692753204628!5m2!1sth!2sth"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MainLocationPage;
