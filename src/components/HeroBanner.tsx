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
    <section className="relative bg-kk-night text-white overflow-hidden">
      {/* Halo décoratif */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-kk-mint/10 blur-3xl" aria-hidden="true"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Content */}
        <div className="text-center lg:text-left kk-fade-up">
          <h1 className="font-display font-extrabold tracking-tight text-5xl md:text-6xl lg:text-7xl mb-10 md:mb-12 leading-[0.95]">
            Tasarruf Et, <span className="text-kk-lime">İsrafı Önle</span>, <br />Dünyayı Kurtar
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="/offers"
              className="kk-btn-primary px-8 py-4 text-lg shadow-lg"
            >
              Kap Kurtar
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="/for-merchants"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors text-lg"
            >
              Sat Kurtar
            </a>
          </div>
        </div>

        {/* Photos */}
        <div className="relative h-[340px] sm:h-[420px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
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
              <div className="absolute inset-0 bg-gradient-to-t from-kk-night/70 via-kk-night/10 to-transparent"></div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Önceki görsel"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-kk-night/60 backdrop-blur text-white p-3 rounded-full hover:bg-kk-night/80 transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Sonraki görsel"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-kk-night/60 backdrop-blur text-white p-3 rounded-full hover:bg-kk-night/80 transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`${index + 1}. görsel`}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-kk-lime' : 'w-2.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
