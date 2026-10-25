import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Taze Akdeniz kasesi'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Taş fırın pizza'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Gurme burger'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      alt: 'Taze fırın ürünleri'
    },
    {
      id: 5,
      image: 'https://images.pexels.com/photos/8931660/pexels-photo-8931660.jpeg',
      alt: 'Taze yiyecekler'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30"></div>
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-5xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-16 md:mb-20 lg:mb-24 leading-tight">
            Tasarruf Et, <span className="text-[#F75C00]">İsrafı Önle</span>, <br />Dünyayı Kurtar
          </h1> 
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="/offers"
              className="bg-[#00A690] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#F75C00] transition-colors duration-300 inline-flex items-center text-lg shadow-lg"
            >
              Kap Kurtar
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="/for-merchants"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-lg"
            >
              Sat Kurtar
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Önceki görsel"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Sonraki görsel"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`${index + 1}. görsel`}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
