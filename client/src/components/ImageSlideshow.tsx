
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageSlideshowProps {
  images: string[];
  title: string;
}

const ImageSlideshow = ({ images, title }: ImageSlideshowProps) => {
  if (!images || images.length === 0) {
    return <div className="bg-gray-200 h-80 w-full rounded-xl flex items-center justify-center">No images available</div>;
  }

  return (
    <Carousel className="w-full relative">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative h-80 w-full overflow-hidden rounded-xl">
              <img 
                src={image} 
                alt={`${title} - image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  );
};

export default ImageSlideshow;
