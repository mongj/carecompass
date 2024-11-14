import Slider from "react-slick";
import Image from "next/image";

export default function PhotoSlider({ photos }: { photos: string[] }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <Slider {...settings} className="mb-6">
        {photos.map((photo, index) => (
          <div key={index} className="relative h-[30vh] w-full">
            <Image
              src={photo}
              alt={`Provider photo ${index + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}
      </Slider>
    </>
  );
}
