import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Play, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  
  // TMDB se aane wali extra details
  const [tmdbDetails, setTmdbDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null); // 🔥 Trailer ke liye nayi state
  
  const [loading, setLoading] = useState(true);
  
  // 🔥 Player Control States
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false); 
  const [isMoviePlaying, setIsMoviePlaying] = useState(false); 

  const TMDB_API_KEY = "944a4dcfa30d2998783dd7ba8ba5c664";

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        // 1. Apne MongoDB backend se movie laao
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/${id}`);
        const movieData = res.data;
        setMovie(movieData);

        // 2. IMDB ID use karke TMDB se Background, Cast aur TRAILER mangwao
        if (movieData.imdbId) {
          const findUrl = `https://api.themoviedb.org/3/find/${movieData.imdbId}?external_source=imdb_id&api_key=${TMDB_API_KEY}`;
          const tmdbRes = await axios.get(findUrl);
          
          if (tmdbRes.data.movie_results && tmdbRes.data.movie_results.length > 0) {
            const tmdbId = tmdbRes.data.movie_results[0].id;
            
            // TMDB se full details (Runtime waghera)
            const detailRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
            setTmdbDetails(detailRes.data);

            // TMDB se Cast (Actors)
            const creditsRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`);
            setCast(creditsRes.data.cast.slice(0, 8)); // Sirf shuru ke 8 actors lenge

            // 🔥 TMDB se Videos (Trailer) nikalna
            const videoRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`);
            const ytTrailer = videoRes.data.results.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
            if(ytTrailer) {
                setTrailerKey(ytTrailer.key);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo(0, 0); // Page load hotay hi top par scroll kar dega
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center flex-col">
        <h1 className="text-3xl text-red-500 font-bold mb-4">Movie Not Found 😢</h1>
        <Link to="/" className="text-gray-400 hover:text-white underline">Wapis Home Par Jayein</Link>
      </div>
    );
  }

  // Background Image Logic
  const backdropUrl = tmdbDetails?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${tmdbDetails.backdrop_path}` 
    : movie.posterUrl; 

  // Player URLs
  const videoUrl = movie.customUrl && movie.customUrl !== "" 
    ? movie.customUrl 
    : `https://vsembed.ru/embed/movie/${movie.imdbId}`;
    
  const youtubeTrailerUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1`;

  // Movie Play Karne Ka Function (Scroll top kar dega)
  const handlePlayMovie = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsTrailerPlaying(false);
    setIsMoviePlaying(true);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      
      {/* === BACK BUTTON === */}
      <div className="absolute top-20 md:top-24 left-4 md:left-8 z-50">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-300 hover:text-white bg-black/50 px-3 py-2 rounded-lg transition backdrop-blur-sm hover:bg-black/80">
          <ArrowLeft size={20} /> <span className="font-bold hidden sm:block">Back</span>
        </button>
      </div>

      {/* === TOP HERO SECTION (Backdrop + Players) === */}
      <div className="relative w-full h-[40vh] md:h-[70vh] lg:h-[80vh]">
        
        {isMoviePlaying ? (
          // 🔥 FULL MOVIE PLAYER (VidSrc)
          <div className="w-full h-full pt-16 md:pt-0 bg-black">
            <iframe 
              src={videoUrl} 
              className="w-full h-full border-none" 
              allowFullScreen
            ></iframe>
          </div>
        ) : isTrailerPlaying && trailerKey ? (
          // 🔥 YOUTUBE TRAILER PLAYER
          <div className="w-full h-full pt-16 md:pt-0 bg-black">
            <iframe 
              src={youtubeTrailerUrl} 
              className="w-full h-full border-none" 
              allowFullScreen
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        ) : (
          // 🖼️ NORMAL BACKDROP + TRAILER BUTTON
          <>
            <img 
              src={backdropUrl} 
              alt="Backdrop" 
              className="w-full h-full object-cover opacity-40 md:opacity-50"
            />
            {/* Dark gradient for text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            
            {/* Center Play Trailer Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {trailerKey ? (
                <button 
                  onClick={() => setIsTrailerPlaying(true)}
                  className="group flex flex-col items-center gap-3 transition transform hover:scale-110"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 group-hover:border-white group-hover:bg-white/30 transition">
                    <Play size={32} className="text-white ml-2" fill="white" />
                  </div>
                  <span className="font-bold text-lg md:text-xl tracking-wider text-gray-200 group-hover:text-white transition drop-shadow-md">WATCH TRAILER</span>
                </button>
              ) : (
                <span className="text-gray-400 font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">No Trailer Available</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* === MOVIE DETAILS SECTION === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Side: Poster (Chup jayega jab movie/trailer chal raha ho mobile par) */}
          <div className={`w-1/3 md:w-1/4 lg:w-1/5 shrink-0 mx-auto md:mx-0 ${isMoviePlaying || isTrailerPlaying ? 'hidden md:block' : 'block'}`}>
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-full rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-gray-800"
            />
          </div>

          {/* Right Side: Info */}
          <div className="flex flex-col justify-end pt-4 md:pt-20 lg:pt-32">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 text-white drop-shadow-lg">
              {movie.title}
            </h1>
            
            {/* Tags: Rating, Year, Runtime, Category, Language */}
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-4 font-medium">
              {movie.rating && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={18} fill="currentColor" />
                  <span className="font-bold text-white">{movie.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar size={18} className="text-gray-400" />
                <span>{movie.year}</span>
              </div>
              {tmdbDetails?.runtime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock size={18} className="text-gray-400" />
                  <span>{Math.floor(tmdbDetails.runtime / 60)}h {tmdbDetails.runtime % 60}m</span>
                </div>
              )}
              <div className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-bold text-red-400 uppercase tracking-wider">
                {movie.category}
              </div>
              <div className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-bold text-blue-400 uppercase tracking-wider">
                {movie.language}
              </div>
            </div>

            {/* Genres */}
            {movie.genres && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.split(',').map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800/80 border border-gray-700 rounded-full text-xs md:text-sm font-semibold text-gray-300">
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* 🔥 NEW: PLAY FULL MOVIE BUTTON (Asal Movie yahan se chalegi) */}
            <div className="mb-8">
              <button 
                onClick={handlePlayMovie}
                className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-sm md:text-base transition transform hover:-translate-y-1 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              >
                <Play size={20} fill="white" />
                PLAY FULL MOVIE
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-4xl mb-8">
              {movie.description || tmdbDetails?.overview || "Is movie ki description abhi tak mojud nahi hai."}
            </p>

            {/* === CAST SECTION (ACTORS) === */}
            {cast.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-4 border-l-4 border-red-600 pl-3">Top Cast</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                  {cast.map(actor => (
                    <div key={actor.id} className="flex flex-col items-center w-24 shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-800 border border-gray-700 mb-2 shadow-lg">
                        {actor.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                            alt={actor.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center p-2">No Image</div>
                        )}
                      </div>
                      <span className="text-white text-xs md:text-sm font-semibold text-center leading-tight truncate w-full">{actor.name}</span>
                      <span className="text-gray-500 text-[10px] md:text-xs text-center leading-tight truncate w-full mt-0.5">{actor.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;