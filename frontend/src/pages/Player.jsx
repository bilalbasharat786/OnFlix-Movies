import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Server } from 'lucide-react';

const Player = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  
  // === NAYI STATE: Kaunsa server chalana hai (0 matlab pehla, 1 matlab dusra) ===
  const [serverIndex, setServerIndex] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/${id}`);
        setMovie(res.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <div className="text-white text-center mt-20">Loading Movie...</div>;

  // === DUAL SERVER LOGIC ===
  // Yeh tumhari dono domains hain
  const servers = [
    `https://vsembed.ru/embed/movie/${movie.imdbId}`,
    `https://vsembed.su/embed/movie/${movie.imdbId}`
  ];

  // Agar admin ne customUrl (Bunny.net/StreamWish) dala hai, to wo pehli priority hai.
  // Warna jo server select hua hai (serverIndex), wo chalega.
  const videoLink = movie.customUrl && movie.customUrl !== "" 
    ? movie.customUrl 
    : servers[serverIndex];

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center relative">
      
      {/* Back Button */}
      <Link to="/" className="absolute top-5 left-5 z-20 bg-gray-800 p-3 rounded-full hover:bg-red-600 transition">
        <ArrowLeft className="text-white" />
      </Link>

      {/* === SERVER SWITCHER BUTTONS (Sirf tab dikhenge jab customUrl na ho) === */}
      {(!movie.customUrl || movie.customUrl === "") && (
        <div className="absolute top-5 right-5 z-20 flex gap-2">
          <button 
            onClick={() => setServerIndex(0)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition ${serverIndex === 0 ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            <Server size={18} /> Server 1
          </button>
          
          <button 
            onClick={() => setServerIndex(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition ${serverIndex === 1 ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            <Server size={18} /> Server 2
          </button>
        </div>
      )}

      {/* Video Player */}
      <iframe 
        src={videoLink}
        className="w-full h-screen z-10"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      
    </div>
  );
};

export default Player;