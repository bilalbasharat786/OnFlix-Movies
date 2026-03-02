import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Info } from 'lucide-react';

const Hero = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // 1. Backend se un movies ko mangwana jo Admin ne "Hero" ke liye select ki hain
  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        // Hum backend mein yeh naya route banayenge
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/hero`);
        setHeroMovies(res.data);
      } catch (error) {
        console.error("Hero movies fetch karne mein masla:", error);
      }
    };
    fetchHeroMovies();
  }, []);

  // 2. 3 Seconds wala Auto-Slider Logic
  useEffect(() => {
    if (heroMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroMovies.length);
    }, 3000); // 3000ms = 3 seconds

    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (heroMovies.length === 0) return null; // Jab tak movies load na hon, kuch na dikhao

  const movie = heroMovies[currentIndex];

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[85vh] bg-black overflow-hidden flex-shrink-0">
      
      {/* === BACKGROUND IMAGE & BLACK GRADIENTS === */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          src={movie.posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover opacity-60 md:opacity-70 scale-105"
        />
        {/* Neechay aur side se kala saya (Fade effect) taake text clear nazar aaye */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>

      {/* === HERO CONTENT (Title, Description, Buttons) === */}
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-12 sm:px-8 md:pb-24 lg:px-16 z-10">
        
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-2 md:mb-4">
            <span className="text-red-600 font-extrabold tracking-widest text-xs md:text-sm drop-shadow-lg">
                N E W
            </span>
            <span className="bg-gray-800 text-gray-300 text-[10px] md:text-xs px-2 py-0.5 rounded border border-gray-600 font-bold uppercase">
                {movie.category || 'Featured'}
            </span>
        </div>

        {/* Movie Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-2 md:mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] max-w-4xl line-clamp-2">
          {movie.title}
        </h1>

        {/* Movie Description */}
        <p className="text-gray-300 text-xs sm:text-sm md:text-lg max-w-xl md:max-w-2xl mb-6 line-clamp-2 md:line-clamp-3 drop-shadow-md font-medium">
          {movie.description || "Is movie ki zabardast kahani janne ke liye abhi play karein ya details check karein."}
        </p>

        {/* Buttons (Play & More Info) */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => navigate(`/play/${movie._id}`)}
            className="flex items-center justify-center gap-2 bg-white hover:bg-red-600 text-black hover:text-white px-5 py-2 md:px-8 md:py-3 rounded-md font-bold text-sm md:text-lg transition-all duration-300 shadow-lg group"
          >
            <Play size={20} className="fill-black group-hover:fill-white transition-colors" /> Play
          </button>

          <button
            onClick={() => navigate(`/watch/${movie._id}`)}
            className="flex items-center justify-center gap-2 bg-gray-500/50 hover:bg-gray-500/70 text-white px-5 py-2 md:px-8 md:py-3 rounded-md font-bold text-sm md:text-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Info size={20} /> More Info
          </button>
        </div>
      </div>

      {/* === SLIDER DOTS (Indicators) === */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {heroMovies.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${
              index === currentIndex ? 'w-6 md:w-8 bg-red-600' : 'w-2 md:w-3 bg-gray-600'
            }`}
          ></div>
        ))}
      </div>

    </div>
  );
};

export default Hero;