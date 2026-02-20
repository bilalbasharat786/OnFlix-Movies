import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // ID lene ke liye
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const Player = () => {
  const { id } = useParams(); // URL se ID nikalo
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Backend se specific movie mangwano
const res = await axios.get(`${import.meta.env.VITE_API_URL}/movies/${id}`);
        setMovie(res.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <div className="text-white text-center mt-20">Loading Movie...</div>;

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center relative">
      
      {/* Back Button */}
      <Link to="/" className="absolute top-5 left-5 z-10 bg-gray-800 p-3 rounded-full hover:bg-red-600 transition">
        <ArrowLeft className="text-white" />
      </Link>

  {/* Video Player */}
      <iframe 
        src={`https://vsembed.ru/embed/movie/${movie.imdbId}`}
        className="w-full h-screen"
        frameBorder="0"
        allowFullScreen

      ></iframe>
      
    </div>
  );
};

export default Player;