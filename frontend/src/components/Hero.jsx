import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Info } from 'lucide-react';

const Hero = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // 1. Backend se hero movies mangwana
  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/hero`);
        setHeroMovies(res.data);
      } catch (error) {
        console.error("Hero movies fetch karne mein masla:", error);
      }
    };
    fetchHeroMovies();
  }, []);

  // 2. 3 Seconds wala Auto-Slider
  useEffect(() => {
    if (heroMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroMovies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (heroMovies.length === 0) return null;

  const movie = heroMovies[currentIndex];

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] bg-black overflow-hidden flex-shrink-0 flex items-center justify-center">
      
      {/* === BACKGROUND IMAGE (Full Visibility) === */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <img
          src={movie.posterUrl} 
          alt={movie.title}
          // 🔥 object-contain se poora poster nazar aayega
          className="w-full h-full object-contain transition-opacity duration-1000 ease-in-out"
        />
      </div>

      {/* === HERO CONTENT (Without Overlays) === */}
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-14 sm:px-8 md:pb-20 lg:px-16 z-10 pointer-events-none">
        
        {/* Buttons aur text ko clickable rakhne ke liye pointer-events-auto */}
        <div className="pointer-events-auto">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-red-600 font-extrabold tracking-widest text-[10px] md:text-sm drop-shadow-md">
                    N E W
                </span>
                <span className="bg-gray-800/80 text-gray-200 text-[8px] md:text-xs px-2 py-0.5 rounded border border-gray-600 uppercase">
                    {movie.category || 'Featured'}
                </span>
            </div>

            {/* Movie Title */}
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] max-w-4xl">
              {movie.title}
            </h1>

            {/* Movie Description (Optional on very small screens) */}
            <p className="text-gray-200 text-[10px] sm:text-xs md:text-lg max-w-xl mb-4 line-clamp-2 drop-shadow-[0_2px_5px_rgba(0,0,0,1)] font-medium">
              {movie.description || "Watch this movie now."}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-2 md:gap-4 mb-2">
              <button
                onClick={() => navigate(`/play/${movie._id}`)}
                className="flex items-center justify-center gap-1 md:gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 md:px-8 md:py-3 rounded-md font-bold text-xs md:text-lg transition-all shadow-xl"
              >
                <Play size={16} className="md:w-5 md:h-5 fill-white" /> Play
              </button>

              <button
                onClick={() => navigate(`/watch/${movie._id}`)}
                className="flex items-center justify-center gap-1 md:gap-2 bg-gray-200/20 hover:bg-gray-200/40 text-white px-4 py-1.5 md:px-8 md:py-3 rounded-md font-bold text-xs md:text-lg transition-all backdrop-blur-md border border-white/30"
              >
                <Info size={16} className="md:w-5 md:h-5" /> Details
              </button>
            </div>
        </div>
      </div>

      {/* === SLIDER DOTS === */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
        {heroMovies.map((_, index) => (
          <div
            key={index}
            className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex ? 'w-5 md:w-8 bg-red-600' : 'w-1.5 md:w-2 bg-gray-500'
            }`}
          ></div>
        ))}
      </div>

    </div>
  );
};

export default Hero;