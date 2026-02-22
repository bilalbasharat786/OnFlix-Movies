import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Play } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // === URL se Navbar wala Search Word nikalna ===
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Backend se movies mangwana
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

  // === FAST FILTER LOGIC (0-Lag) ===
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      {/* Title (Agar search ho raha hai to title change hoga) */}
      <h1 className="text-2xl md:text-4xl font-bold text-red-600 mb-8">
        {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Movies"}
      </h1>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        
        {loading ? (
          // === SKELETON LOADER ===
          [...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 h-64 rounded-lg mb-2"></div>
              <div className="bg-gray-800 h-4 w-3/4 rounded"></div>
            </div>
          ))
        ) : filteredMovies.length === 0 ? (
          // === NO MOVIE FOUND MESSAGE ===
          <div className="col-span-full text-center text-gray-400 mt-10">
            <p className="text-xl">Koi movie nahi mili "{searchQuery}" ke naam se 😢</p>
          </div>
        ) : (
          // === REAL MOVIES LIST ===
          filteredMovies.map((movie) => (
            <Link to={`/watch/${movie._id}`} key={movie._id} className="group relative shadow-lg">
              {/* Poster Image */}
              <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                />
                
                {/* Hover Overlay with Play Button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition duration-300">
                  <Play className="text-white opacity-0 group-hover:opacity-100 w-12 h-12" fill="white" />
                </div>
              </div>

              {/* Movie Title */}
              <h3 className="mt-2 text-sm md:text-lg font-semibold truncate text-white">{movie.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm">{movie.year} • {movie.language}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;