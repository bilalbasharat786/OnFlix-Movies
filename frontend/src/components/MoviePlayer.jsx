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

  // 🔥 NAYI STATE: Mobile Check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Screen resize listener
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
        
        const url = movie.customUrl && movie.customUrl !== "" 
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

  // 🔥 SMART LOADER LOGIC 🔥
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
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      
      {/* 🔙 BACK BUTTON */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-1 md:gap-2 text-white bg-gray-900/80 hover:bg-red-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-base transition-colors backdrop-blur-md"
      >
        <ArrowLeft size={isMobile ? 16 : 20} /> 
        <span className="hidden sm:block">Back to Details</span>
        <span className="sm:hidden">Back</span>
      </button>

      {/* 🔥 MAIN PLAYER CONTAINER 🔥 */}
      <div className="w-full aspect-video bg-black relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
        
        {/* === JADUI PARDA (LOADING OVERLAY) === */}
        {!iframeLoaded && (
          <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center">
            <Loader2 size={isMobile ? 40 : 60} className="text-red-600 animate-spin mb-3 md:mb-4" />
            <div className="text-white font-bold text-lg md:text-2xl tracking-widest drop-shadow-lg">
              LOADING <span className="text-red-500">{loadingProgress}%</span>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-2 animate-pulse">Establishing secure connection...</p>
          </div>
        )}

        {/* === ASAL MOVIE PLAYER (Backstage loading) === */}
        <iframe 
          src={videoUrl} 
          onLoad={() => setIframeLoaded(true)} 
          className="absolute border-none pointer-events-auto" 
          style={{
            // 🔥 FINAL BULLETPROOF MATH (No more cut videos!)
            width: isMobile ? '140%' : '135%',       
            height: '400%',      
            top: '-15%', // Dono mein same crop taake video ka top hissa na katay
            left: isMobile ? '-20%' : '-17.5%', // Center karne ka exact formula
            opacity: iframeLoaded ? 1 : 0, 
            transition: 'opacity 0.5s ease-in-out' 
          }}
          allowFullScreen
        ></iframe>

      </div>
    </div>
  );
};

export default MoviePlayer;