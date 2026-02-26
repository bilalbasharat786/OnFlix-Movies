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

  // 🔥 YEAR FILTER STATE
  const [selectedYear, setSelectedYear] = useState('');

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // 1. Jab Search ya Year badlay, to page 1 aur movies reset kardo
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery, selectedYear]);

  // 2. Backend se movies mangwana (🔥 DEBOUNCE + ABORT CONTROLLER MAGIC)
  useEffect(() => {
    const controller = new AbortController(); 

    const fetchMovies = async () => {
      if (!hasMore && page !== 1) return; 

      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        let url = "";
        if (searchQuery) {
          url = `${import.meta.env.VITE_API_URL}/api/movies/search?q=${searchQuery}&page=${page}&limit=20`;
        } else {
          url = `${import.meta.env.VITE_API_URL}/api/movies/all?page=${page}&limit=20`;
        }

        if (selectedYear) {
            url += `&year=${selectedYear}`;
        }

        const res = await axios.get(url, { signal: controller.signal });

        if (page === 1) {
          setMovies(res.data);
        } else {
          setMovies((prevMovies) => [...prevMovies, ...res.data]);
        }

        if (res.data.length < 20) {
          setHasMore(false);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("⏳ Pichli search cancel kar di gayi:", searchQuery);
        } else {
          console.error("❌ Error fetching movies:", error);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    const delayTimer = setTimeout(() => {
      fetchMovies();
    }, 300);

    return () => {
      clearTimeout(delayTimer); 
      controller.abort(); 
    };
  }, [page, searchQuery, selectedYear]);

  // 3. Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
        if (hasMore && !loading && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadingMore]);

  const yearsList = Array.from({ length: 27 }, (_, i) => 2026 - i);

  return (
    <div className="p-4 md:p-8">
      
      {/* HEADER AUR YEAR DROPDOWN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-red-600">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Movies"}
        </h1>

        <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded-lg border border-gray-700 shadow-lg">
            <label className="text-gray-400 font-semibold text-sm whitespace-nowrap">Filter Year:</label>
            <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-black text-red-500 font-bold border-none focus:outline-none focus:ring-0 cursor-pointer text-sm"
            >
                <option value="">All Years</option>
                {yearsList.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-x-6 md:gap-y-10">
        
        {loading && page === 1 ? (
          [...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 h-64 rounded-lg mb-2"></div>
              <div className="bg-gray-800 h-4 w-3/4 rounded"></div>
            </div>
          ))
        ) : movies.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 mt-10">
            <p className="text-xl">
              {selectedYear ? `Koi movie nahi mili ${selectedYear} saal ki 😢` : `Koi movie nahi mili "${searchQuery}" ke naam se 😢`}
            </p>
          </div>
        ) : (
          movies.map((movie) => {
            // 🔥 RATING LOGIC: 8.5 ko 85% banayega, agar rating na ho to 0
            const percentage = movie.rating ? Math.round(Number(movie.rating) * 10) : 0;
            // Rang (Color) ki logic
            const ringColor = percentage >= 70 ? 'border-[#21d07a]' : percentage >= 50 ? 'border-[#d2d531]' : 'border-[#db2360]';

            return (
              <Link to={`/watch/${movie._id}`} key={movie._id} className="group relative shadow-lg flex flex-col">
                
                {/* === POSTER & OVERLAPPING BADGE CONTAINER === */}
                <div className="relative w-full">
                  <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                    />
                  </div>

                  {/* 🔥 RATING BADGE (Bilkul TMDB Style) */}
                  {percentage > 0 && (
                    <div className={`absolute -bottom-5 left-3 w-10 h-10 md:w-11 md:h-11 bg-[#081c22] rounded-full flex items-center justify-center border-[3px] shadow-lg z-10 ${ringColor}`}>
                      <span className="text-white text-xs md:text-sm font-bold">
                        {percentage}<span className="text-[8px] font-normal">%</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* === MOVIE DETAILS === */}
                <div className="mt-6 flex flex-col">
                  <h3 className="text-sm md:text-lg font-semibold truncate text-white" title={movie.title}>{movie.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm mt-0.5">{movie.year} • {movie.language}</p>
                  
                  {/* 🔥 GENRES (Ab neechay show hongay) */}
                  {movie.genres && (
                    <p className="text-gray-500 text-[10px] md:text-xs truncate mt-0.5" title={movie.genres}>
                      {movie.genres}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
          <span className="ml-3 text-red-500 font-bold">Loading more movies...</span>
        </div>
      )}

      {!hasMore && movies.length > 0 && !loading && (
        <div className="text-center text-gray-600 py-8 font-semibold">
          🎉 Aapne saari movies dekh li hain!
        </div>
      )}
    </div>
  );
};

export default Home;