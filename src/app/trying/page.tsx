import React from 'react';
import TouristSearchComponent from '@/components/Search/TouristSearchComponent';

const TouristSearchPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-8 mb-4 md:text-4xl lg:text-5xl  text-orange-500 ">ค้นหาสถานที่ที่คุณต้องการเลย!</h1>
      <TouristSearchComponent />
    </div>
  );
};

export default TouristSearchPage;
