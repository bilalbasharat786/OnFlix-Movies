import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Play } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // === 🚀 INFINITE SCROLL STATES ===
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // === URL se Navbar wala Search Word nikalna ===
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // 1. Jab Search badlay, to page 1 aur movies reset kardo
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  // 2. Backend se movies mangwana (Page ya Search ke hisaab se)
  useEffect(() => {
    const fetchMovies = async () => {
      // Agar mazeed movies nahi hain, to API call mat karo
      if (!hasMore) return; 

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        let url = "";
        if (searchQuery) {
          // Global Search API Call
          url = `${import.meta.env.VITE_API_URL}/api/movies/search?q=${searchQuery}&page=${page}&limit=20`;
        } else {
          // Normal API Call Pagination ke sath
          url = `${import.meta.env.VITE_API_URL}/api/movies/all?page=${page}&limit=20`;
        }

        const res = await axios.get(url);

        if (page === 1) {
          setMovies(res.data);
        } else {
          // Purani movies mein nayi movies jor do (Infinite Scroll Magic)
          setMovies((prevMovies) => [...prevMovies, ...res.data]);
        }

        // Agar backend ne 20 se kam movies bheji hain, matlab data khatam ho gaya
        if (res.data.length < 20) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchMovies();
  }, [page, searchQuery]);

  // 3. Infinite Scroll Listener (Bottom par pohanchne par Page + 1 karna)
  useEffect(() => {
    const handleScroll = () => {
      // Check agar user page ke bilkul bottom par pohanch gaya hai
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
        if (hasMore && !loading && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadingMore]);


  return (
    <div className="p-4 md:p-8">
      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-red-600 mb-8">
        {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Movies"}
      </h1>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        
        {loading && page === 1 ? (
          // === SKELETON LOADER (Sirf pehle page load par dikhega) ===
          [...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 h-64 rounded-lg mb-2"></div>
              <div className="bg-gray-800 h-4 w-3/4 rounded"></div>
            </div>
          ))
        ) : movies.length === 0 ? (
          // === NO MOVIE FOUND MESSAGE ===
          <div className="col-span-full text-center text-gray-400 mt-10">
            <p className="text-xl">Koi movie nahi mili "{searchQuery}" ke naam se 😢</p>
          </div>
        ) : (
          // === REAL MOVIES LIST ===
          movies.map((movie) => (
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

      {/* Loading More Spinner (Neechay scroll karne par) */}
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
          <span className="ml-3 text-red-500 font-bold">Loading more movies...</span>
        </div>
      )}

      {/* End of results message */}
      {!hasMore && movies.length > 0 && !loading && (
        <div className="text-center text-gray-600 py-8 font-semibold">
          🎉 Aapne saari movies dekh li hain!
        </div>
      )}
    </div>
  );
};

export default Home;