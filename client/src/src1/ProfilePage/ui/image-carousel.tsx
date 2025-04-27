import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface ImageCarouselProps {
  images: string[];
  autoSlideInterval?: number;
  className?: string;
  imageClassName?: string;
  showControls?: boolean;
  showIndicators?: boolean;
  alt?: string;
}

export function ImageCarousel({
  images,
  autoSlideInterval = 5000,
  className,
  imageClassName,
  showControls = true,
  showIndicators = true,
  alt = "Carousel image",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slideCount = images.length;

  const resetAutoPlayTimeout = useCallback(() => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }

    if (isAutoPlaying && slideCount > 1) {
      autoPlayTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
      }, autoSlideInterval);
    }
  }, [isAutoPlaying, slideCount, autoSlideInterval]);

  useEffect(() => {
    resetAutoPlayTimeout();
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [currentIndex, resetAutoPlayTimeout]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetAutoPlayTimeout();
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slideCount) % slideCount);
    resetAutoPlayTimeout();
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
    resetAutoPlayTimeout();
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
    resetAutoPlayTimeout();
  };

  // If there are no images or only one image, don't render controls or indicators
  if (slideCount === 0) {
    return null;
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-gray-100 group",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-in-out",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              className={cn(
                "w-full h-full object-cover",
                imageClassName
              )}
            />
          </div>
        ))}
      </div>

      {showControls && slideCount > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevSlide();
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              goToNextSlide();
            }}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {showIndicators && slideCount > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full",
                index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
