
import Carousel from '@/components/Carousel'
import RealTimeSeasonalAttractions from '@/components/Places/RealTime'
import TopRatedCarousel from '@/components/Places/TopRatedCarousel'

export default function Home() {
  return (
  <>
  <div><Carousel/></div>
<div> <RealTimeSeasonalAttractions /></div>
    <div>
      <TopRatedCarousel />
    </div>
   </>
  );
}
