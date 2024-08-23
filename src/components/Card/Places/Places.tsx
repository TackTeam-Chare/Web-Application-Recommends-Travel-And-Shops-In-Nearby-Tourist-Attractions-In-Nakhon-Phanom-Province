import Image from "next/image";
import { PlaceCardProps } from "@/models/interface";

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {place.image_url && place.image_url[0] ? (
        <Image
          src={place.image_url[0]}
          alt={place.name}
          width={500}
          height={300}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">ไม่มีรูปภาพ</span>
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold">{place.name}</h2>
        <p className="text-gray-600">{place.description}</p>
      </div>
    </div>
  );
};

export default PlaceCard;
