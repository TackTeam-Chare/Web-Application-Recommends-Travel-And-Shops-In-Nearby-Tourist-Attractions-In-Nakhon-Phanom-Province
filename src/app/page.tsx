
import Carousel from '@/components/Carousel'
import PlacesRandom from '@/components/Card/Places/PlacesRandom'
import RealTimeSeasonalAttractions from '@/components/Card/Places/RealTime'
import TopRatedCarousel from '@/components/Card/Places/TopRatedCarousel'

export default function Home() {
  return (
  <>
  <div>  <Carousel /></div>
<div> <RealTimeSeasonalAttractions /></div>
    <div>
      <TopRatedCarousel />
    </div>
<div>    <PlacesRandom /></div>
   </>
  );
}
