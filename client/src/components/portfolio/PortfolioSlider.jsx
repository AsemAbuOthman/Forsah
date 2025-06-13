import React, { useState } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PortfolioSlider = ({
  images = [],
  title = '',
  autoplaySpeed = 3000,
  height = 'h-48'
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);

  const NextArrow = ({ onClick }) => (
    <button
      className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-md opacity-80 hover:opacity-100 transition-opacity duration-200"
      onClick={onClick}
      aria-label="Next slide"
    >
      <ChevronRight size={16} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-md opacity-80 hover:opacity-100 transition-opacity duration-200"
      onClick={onClick}
      aria-label="Previous slide"
    >
      <ChevronLeft size={16} />
    </button>
  );

  const handleDotClick = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handleBulletClick = (index) => {
    setSelectedImageIndex(index);
    if (sliderRef) {
      sliderRef.slickGoTo(index);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: false,
    appendDots: (dots) => (
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <ul className="flex space-x-1.5">
          {dots.map((dot, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleDotClick(index);
              }}
              className="cursor-pointer"
            >
              {dot}
            </div>
          ))}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-1.5 h-1.5 rounded-full bg-white/70 hover:bg-white transition-colors duration-200"></div>
    ),
  };

  if (images.length === 0) {
    return (
      <div className={`w-full ${height} bg-gray-100 flex items-center justify-center rounded-t-lg`}>
        <span className="text-gray-500 text-sm">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full ${height} overflow-hidden rounded-t-lg relative group`}>
        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index} className={`relative ${height}`}>
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className={`w-full ${height} object-cover`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  e.target.alt = 'Image not available';
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {showImageModal && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="relative w-full max-w-6xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            
            <div className="flex-grow relative">
              <img
                src={images[selectedImageIndex]}
                alt={`${title} ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                  e.target.alt = 'Image not available';
                }}
              />
            </div>

            <div className="flex justify-center items-center gap-2 py-4 bg-black/50 mt-4 rounded-lg">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBulletClick(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    selectedImageIndex === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioSlider;