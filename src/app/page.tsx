
import Carousel from '@/components/Carousel'
import PlacesRandom from '@/components/Card/Places/PlacesRandom'
import RealTimeSeasonalAttractions from '@/components/Card/Places/RealTime'

export default function Home() {
  return (
  <>
  <div>  <Carousel /></div>
  <div>    <PlacesRandom /></div>
<div> <RealTimeSeasonalAttractions /></div>
   </>
  );
}
