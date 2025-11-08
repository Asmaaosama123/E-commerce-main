// src/components/HeroSection.jsx
import React, { useEffect, useState } from "react";

const HeroSection = ({ category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = category?.heroImages || [];

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images]);

  if (!images.length) {
    return (
      <div className="w-full h-[150px] md:h-[200px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[150px] md:h-[200px] overflow-hidden rounded-lg">
      <img
        src={images[currentIndex]}
        alt="Hero"
        className="w-full h-full object-cover transition-all duration-700"
      />
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === currentIndex ? "bg-yellow-500" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
