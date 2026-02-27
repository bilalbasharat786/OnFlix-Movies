import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const MoviePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ID ke zariye database se movie ka link lana
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/${id}`);
        const movie = res.data;
        
        // Agar custom Koyeb url hai toh wo, warna VidSrc auto server
        const url = movie.customUrl && movie.customUrl !== "" 
          ? movie.customUrl 
          : `https://vsembed.ru/embed/movie/${movie.imdbId}`;
          
        setVideoUrl(url);
      } catch (error) {
        console.error("Movie link laane mein masla aya:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      
      {/* 🔙 BACK BUTTON (Top Left par fixed rahega) */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 z-50 flex items-center gap-2 text-white bg-gray-900/80 hover:bg-red-600 px-4 py-2 rounded-lg font-bold transition-colors backdrop-blur-md"
      >
        <ArrowLeft size={20} /> Back to Details
      </button>

   <div className="w-full max-w-7xl aspect-video bg-black relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* JADU YAHAN HAI: 
            Koyeb ka footer meri umeed se zyada lamba (500px+) tha. 
            Is liye ab humne height ko +600px (mobile) aur +800px (PC) kar diya hai! 
            Ab wo hamesha ke liye overflow-hidden ki waja se dafan ho jayega.
        */}
        <div className="absolute top-[-80px] md:top-[-100px] left-0 right-0 w-full h-[calc(100%+600px)] md:h-[calc(100%+800px)]">
          <iframe 
            src={videoUrl} 
            className="w-full h-full border-none pointer-events-auto" 
            allowFullScreen
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default MoviePlayer;