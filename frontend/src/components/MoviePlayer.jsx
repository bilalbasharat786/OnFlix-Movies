import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

const MoviePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  
  // States for Loading Logic
  const [isFetchingLink, setIsFetchingLink] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/${id}`);
        const movie = res.data;
        
        let url = movie.customUrl && movie.customUrl !== "" 
          ? movie.customUrl 
          : `https://vsembed.ru/embed/movie/${movie.imdbId}`;
          
        setVideoUrl(url);
      } catch (error) {
        console.error("Movie link laane mein masla aya:", error);
      } finally {
        setIsFetchingLink(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    let interval;
    if (videoUrl && !iframeLoaded) {
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.floor(Math.random() * 11) + 5; 
        });
      }, 500);
    } 
    else if (iframeLoaded) {
      setLoadingProgress(100);
    }
    return () => clearInterval(interval);
  }, [videoUrl, iframeLoaded]);

  if (isFetchingLink) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-50">
      
      {/* 🔙 BACK BUTTON */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 md:top-6 md:left-6 z-[100] flex items-center gap-1 md:gap-2 text-white bg-gray-900/80 hover:bg-red-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-base transition-colors backdrop-blur-md shadow-lg"
      >
        <ArrowLeft size={isMobile ? 16 : 20} /> 
        <span className="hidden sm:block">Back to Details</span>
        <span className="sm:hidden">Back</span>
      </button>

      {/* === JADUI PARDA (LOADING OVERLAY) === */}
      {!iframeLoaded && (
        <div className="absolute inset-0 z-[90] bg-black flex flex-col items-center justify-center">
          <Loader2 size={isMobile ? 40 : 60} className="text-red-600 animate-spin mb-3 md:mb-4" />
          <div className="text-white font-bold text-lg md:text-2xl tracking-widest drop-shadow-lg">
            LOADING <span className="text-red-500">{loadingProgress}%</span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-2 animate-pulse">Bypassing restrictions...</p>
        </div>
      )}

      {/* 🔥 THE MASTER JUGAAD CONTAINER 🔥 */}
      <div className="relative w-full h-full">
        
        {/* IFRAME: Mobile aur Desktop dono ke liye best fit */}
        <iframe
          src={videoUrl}
          onLoad={() => setIframeLoaded(true)}
          allowFullScreen
          className={`absolute border-none transition-opacity duration-1000 ${iframeLoaded ? "opacity-100" : "opacity-0"}
          md:w-[125vw] md:h-[120vh] md:-top-[10vh] md:-left-[2vw]
          w-[100vw] h-[150vh] -top-[2vh] left-0
          `}
        ></iframe>

        {/* ⬛ BLACK OVERLAYS (KAALI PATTIYAN) ⬛ */}
        
        {/* 1. Top Header Cover (Top height adjust ki hai) */}
        <div className="absolute top-0 left-0 w-full h-[6vh] md:h-[10vh] bg-black z-[80] pointer-events-auto"></div>
        
        {/* 2. Right Sidebar Cover (Sirf Desktop ke liye) */}
        <div className="hidden md:block absolute top-0 right-0 w-[22vw] h-full bg-black z-[80] pointer-events-auto"></div>
        
        {/* 3. Bottom Text Cover (Mobile par 45vh kar diya taake Telegram wale button chup jayein) */}
        <div className="absolute bottom-0 left-0 w-full h-[45vh] md:h-[28vh] bg-black z-[80] pointer-events-auto"></div>

      </div>
      
    </div>
  );
};

export default MoviePlayer;