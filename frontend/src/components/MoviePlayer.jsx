import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const MoviePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  
  // States for Loading & ID Logic
  const [isFetchingLink, setIsFetchingLink] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  // 🔥 Check karne ke liye ke phone rotate hai ya nahi
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  // Screen resize & orientation listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
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

  if (isFetchingLink) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    // Pura page cover kar liya aur overflow hidden kar diya
    <div className="fixed inset-0 bg-black overflow-hidden z-50">
      
      {/* 🔥 THE MAGIC FIX: Fullscreen Reset Styles 🔥 */}
      {/* Jab user fullscreen button dabayega toh yeh CSS humare shift kiye hue iframe ko wapis 100% normal kar degi taake video na kate! */}
      <style>
        {`
          iframe:fullscreen, 
          iframe:-webkit-full-screen, 
          iframe:-moz-full-screen, 
          iframe:-ms-fullscreen {
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            transform: none !important;
          }
        `}
      </style>

      {/* 🔙 BACK BUTTON */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 lg:top-6 lg:left-6 z-[100] flex items-center gap-1 lg:gap-2 text-white bg-gray-900/80 hover:bg-red-600 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-bold text-xs lg:text-base transition-colors backdrop-blur-md shadow-lg"
      >
        <ArrowLeft size={isMobile ? 16 : 20} /> 
        <span className="hidden sm:block">Back to Details</span>
        <span className="sm:hidden">Back</span>
      </button>

      {/* === 🔥 MOBILE ROTATE PROMPT (Sirf Mobile & Portrait par show hoga) === */}
      {isMobile && !isLandscape && (
        <div className="absolute inset-0 z-[90] bg-black flex flex-col items-center justify-center p-6 text-center">
          <RotateCcw size={60} className="text-red-600 animate-pulse mb-6" />
          <div className="text-white font-bold text-2xl tracking-widest drop-shadow-lg mb-2">
            🔒 PLEASE ROTATE YOUR PHONE
          </div>
          <p className="text-gray-400 text-sm animate-pulse">For clean, full-screen and better experience.</p>
        </div>
      )}

      {/* === JADUI PARDA (SIMPLE LOADER) === */}
      {videoUrl && !iframeLoaded && (
        <div className="absolute inset-0 z-[85] bg-black flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-500 text-sm animate-pulse">Establishing secure connection...</p>
        </div>
      )}

      {/* 🔥 THE MASTER JUGAAD CONTAINER 🔥 */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        <iframe
          src={videoUrl}
          onLoad={() => setIframeLoaded(true)}
          allowFullScreen
          className={`absolute border-none transition-opacity duration-1000 ${iframeLoaded ? "opacity-100" : "opacity-0"}
          /* ✅ DESKTOP SETUP (UNTOUCHED - Safe) */
          md:w-[125vw] md:h-[120vh] md:-top-[10vh] md:-left-[2vw] md:scale-100
          /* ✅ MOBILE SETUP: Default landscape view (Neechay se na katne ke liye) */
          w-[100vw] h-[120vh] -top-[10vh] left-0
          `}
        ></iframe>

        {/* ⬛ BLACK OVERLAYS (KAALI PATTIYAN - Desktop Only) ⬛ */}
        
        {/* 1. Top Header Cover */}
        <div className="hidden md:block absolute top-0 left-0 w-full h-[1vh] bg-black z-[80] pointer-events-auto"></div>
        
        {/* 2. Right Sidebar Cover */}
        <div className="hidden md:block absolute top-0 right-0 w-[24vw] h-full bg-black z-[80] pointer-events-auto"></div>
        
        {/* 3. Bottom Text Cover */}
        <div className="hidden md:block absolute bottom-0 left-0 w-full h-[15vh] bg-black z-[80] pointer-events-auto"></div>

      </div>
      
    </div>
  );
};

export default MoviePlayer;