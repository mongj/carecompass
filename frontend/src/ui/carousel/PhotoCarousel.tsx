import Carousel from "./Carousel";
import Image from "next/image";

export default function PhotoCarousel({ photos }: { photos: string[] }) {
  return (
    <Carousel
      slides={photos.map((photo, index) => (
        <Image
          src={photo}
          alt="photo"
          key={index}
          width={4000}
          height={1080}
          className="w-full"
        />
      ))}
    />
  );
}
