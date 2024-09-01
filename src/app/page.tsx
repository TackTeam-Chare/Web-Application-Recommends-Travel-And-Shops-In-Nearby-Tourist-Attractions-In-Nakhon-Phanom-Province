import BackgroundVideo from "@/components/BackgroundVideo";
import Carousel from '@/components/Carousel'
import NearbyPlaces from '@/components/Places/NearbyPlaces';
import RealTimeSeasonalAttractions from '@/components/Places/RealTime'
import TopRatedCarousel from '@/components/Places/TopRatedCarousel'

export default function Home() {
  return (
  <>  
  {/* <BackgroundVideo /> */}
  <div><Carousel/></div>
<div> <RealTimeSeasonalAttractions /></div>
    <div>
      <TopRatedCarousel />
    </div>
    <div>
      <NearbyPlaces />
    </div>
   </>
  );
}
