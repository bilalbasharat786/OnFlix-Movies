import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Play } from 'lucide-react';

const Hollywood = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navbar se search query pakadne ke liye
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/all`);
        setMovies(res.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // === SMART FILTER: Hollywood + Search ===
  const filteredMovies = movies.filter((movie) => {
    // English ya Dual Audio wali movies Hollywood page par aayengi
    const isHollywood = movie.language === 'English' || movie.language === 'Dual Audio';
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    return isHollywood && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 min-h-screen bg-black">
      <h1 className="text-2xl md:text-4xl font-bold text-blue-500 mb-8">
        {searchQuery ? `Search Results for "${searchQuery}"` : "Hollywood (Hindi Dubbed & English)"}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {loading ? (
          // Skeleton Loader
          [...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 h-64 rounded-lg mb-2"></div>
              <div className="bg-gray-800 h-4 w-3/4 rounded"></div>
            </div>
          ))
        ) : filteredMovies.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 mt-10">
            <p className="text-xl">Koi Hollywood movie nahi mili 😢</p>
          </div>
        ) : (
          filteredMovies.map((movie) => (
            <Link to={`/watch/${movie._id}`} key={movie._id} className="group relative shadow-lg">
              <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition duration-300">
                  <Play className="text-white opacity-0 group-hover:opacity-100 w-12 h-12" fill="white" />
                </div>
              </div>
              <h3 className="mt-2 text-sm md:text-lg font-semibold truncate text-white">{movie.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm">{movie.year} • {movie.language}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Hollywood;