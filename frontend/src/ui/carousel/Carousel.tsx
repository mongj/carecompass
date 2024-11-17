import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./CarouselDotButton";
import useEmblaCarousel from "embla-carousel-react";

type PropType = {
  slides: JSX.Element[];
  options?: EmblaOptionsType;
};

const Carousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className="max-w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-6 flex touch-pan-y">{slides}</div>
      </div>

      <div className="mt-4 grid grid-cols-[auto_1fr] justify-between gap-5">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`flex h-2 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ${
                index === selectedIndex
                  ? "w-8 rounded-full bg-gray-500"
                  : "w-4 rounded-full bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
