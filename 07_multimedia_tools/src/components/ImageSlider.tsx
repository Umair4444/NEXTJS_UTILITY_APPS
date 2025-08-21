"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&auto=format&fit=crop&q=80",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-2xl">
      {/* Background Image */}
      <div
        className="w-full h-[500px] md:h-[650px] lg:h-[750px] bg-cover bg-center transition-all duration-1000 ease-in-out filter brightness-90"
        style={{ backgroundImage: `url(${images[current]})` }}
      >
        {/* Gradient Overlay */}
        <div className="w-full h-full bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      </div>

      {/* Caption */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center px-6 py-4 bg-black/30 backdrop-blur-md rounded-lg shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          Modern Image Slider
        </h2>
        <p className="text-white/80 mt-2 text-sm md:text-base">
          Experience the beauty of the world through mesmerizing photography.
        </p>
      </div>

      {/* Arrows */}
      <Button
        variant="ghost"
        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 text-white shadow-lg transition-all duration-300"
        onClick={prevSlide}
      >
        <ChevronLeft size={36} />
      </Button>

      <Button
        variant="ghost"
        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 text-white shadow-lg transition-all duration-300"
        onClick={nextSlide}
      >
        <ChevronRight size={36} />
      </Button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === current ? "bg-white scale-125" : "bg-white/50"
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}
