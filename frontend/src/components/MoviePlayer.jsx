import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

const MoviePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  
  // States for Loading Logic
  const [isFetchingLink, setIsFetchingLink] = useState(true); // Database se link laane ka loader
  const [iframeLoaded, setIframeLoaded] = useState(false); // Asal Movie load hone ka state
  const [loadingProgress, setLoadingProgress] = useState(0); // 0 se 100% wala number

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
    // Agar link aagaya hai aur movie abhi tak load nahi hui
    if (videoUrl && !iframeLoaded) {
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          // Loader ko 90% par rok do jab tak asli movie load na ho jaye
          if (prev >= 90) return 90;
          // Har aadhay second mein randomly 5 se 15% barhao taake asli lagay
          return prev + Math.floor(Math.random() * 11) + 5; 
        });
      }, 500);
    } 
    // Jaise hi iframe ne bataya ke wo load ho gaya hai, direct 100% kar do
    else if (iframeLoaded) {
      setLoadingProgress(100);
    }

    return () => clearInterval(interval);
  }, [videoUrl, iframeLoaded]);

  // Pehla loader (Jab database se link aa raha ho)
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
        className="absolute top-4 left-4 z-50 flex items-center gap-2 text-white bg-gray-900/80 hover:bg-red-600 px-4 py-2 rounded-lg font-bold transition-colors backdrop-blur-md"
      >
        <ArrowLeft size={20} /> Back to Details
      </button>

      {/* 🔥 MAIN PLAYER CONTAINER 🔥 */}
      <div className="w-full aspect-video bg-black relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
        
        {/* === JADUI PARDA (LOADING OVERLAY) === */}
        {/* Yeh parda tab tak screen par rahega jab tak iframeLoaded true nahi hota */}
        {!iframeLoaded && (
          <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center">
            <Loader2 size={60} className="text-red-600 animate-spin mb-4" />
            <div className="text-white font-bold text-2xl tracking-widest drop-shadow-lg">
              LOADING <span className="text-red-500">{loadingProgress}%</span>
            </div>
            <p className="text-gray-500 text-sm mt-2 animate-pulse">Establishing secure connection...</p>
          </div>
        )}

        {/* === ASAL MOVIE PLAYER (Backstage loading) === */}
        <iframe 
          src={videoUrl} 
          // onLoad event fire hoga jab movie ka player 100% ready ho jayega
          onLoad={() => setIframeLoaded(true)} 
          className="absolute border-none pointer-events-auto" 
          style={{
            // Tumhara CSS Hack bilkul wese hi kaam karega
            width: '135%',       
            height: '400%',      
            top: '-15%',
            // Agar load nahi hui toh background mein chupi rahegi (opacity 0), load hote hi samne aayegi
            opacity: iframeLoaded ? 1 : 0, 
            transition: 'opacity 0.5s ease-in-out' // Smooth fade in effect
          }}
          allowFullScreen
        ></iframe>

      </div>
    </div>
  );
};


export default MoviePlayer;