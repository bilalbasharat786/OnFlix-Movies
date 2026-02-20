import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend se movies mangwana
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Tumhara Backend URL
const res = await axios.get(`${import.meta.env.VITE_API_URL}/movies/all`);
        setMovies(res.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="p-8">
      {/* Navbar jaisa Header */}
      <h1 className="text-4xl font-bold text-red-600 mb-8">OnFlix Movies</h1>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        
        {loading ? (
          // === SKELETON LOADER (Jab tak data aa raha hai) ===
          [...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 h-64 rounded-lg mb-2"></div>
              <div className="bg-gray-800 h-4 w-3/4 rounded"></div>
            </div>
          ))
        ) : (
          // === REAL MOVIES LIST ===
          movies.map((movie) => (
            <Link to={`/watch/${movie._id}`} key={movie._id} className="group relative">
              {/* Poster Image */}
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-300"
                />
                
                {/* Hover Overlay with Play Button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition duration-300">
                  <Play className="text-white opacity-0 group-hover:opacity-100 w-12 h-12" fill="white" />
                </div>
              </div>

              {/* Movie Title */}
              <h3 className="mt-2 text-lg font-semibold truncate">{movie.title}</h3>
              <p className="text-gray-400 text-sm">{movie.year} • {movie.language}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;