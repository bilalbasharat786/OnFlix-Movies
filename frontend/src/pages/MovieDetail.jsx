import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  
  // TMDB se aane wali extra details
  const [tmdbDetails, setTmdbDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false); 

  const TMDB_API_KEY = "944a4dcfa30d2998783dd7ba8ba5c664";

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/${id}`);
        const movieData = res.data;
        setMovie(movieData);

        if (movieData.imdbId) {
          const findUrl = `https://api.themoviedb.org/3/find/${movieData.imdbId}?external_source=imdb_id&api_key=${TMDB_API_KEY}`;
          const tmdbRes = await axios.get(findUrl);
          
          if (tmdbRes.data.movie_results && tmdbRes.data.movie_results.length > 0) {
            const tmdbId = tmdbRes.data.movie_results[0].id;
            
            const detailRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
            setTmdbDetails(detailRes.data);

            const creditsRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`);
            setCast(creditsRes.data.cast.slice(0, 8)); 

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
    window.scrollTo(0, 0); 
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

  const backdropUrl = tmdbDetails?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${tmdbDetails.backdrop_path}` 
    : movie.posterUrl; 
    
  const youtubeTrailerUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1`;

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      
      {/* === BACK BUTTON === */}
      <div className="absolute top-20 md:top-24 left-4 md:left-8 z-50">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-300 hover:text-white bg-black/50 px-3 py-2 rounded-lg transition backdrop-blur-sm hover:bg-black/80">
          <ArrowLeft size={20} /> <span className="font-bold hidden sm:block">Back</span>
        </button>
      </div>

      {/* === TOP HERO SECTION (Backdrop + Trailer) === */}
      {/* 🔥 Mobile par trailer 16:9 ratio mein chalega taake design kharab na ho */}
      <div className={`relative w-full ${isTrailerPlaying ? 'pt-16 md:pt-0 aspect-video md:h-[70vh] lg:h-[80vh]' : 'h-[40vh] md:h-[70vh] lg:h-[80vh]'}`}>
        {isTrailerPlaying && trailerKey ? (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <iframe 
              src={youtubeTrailerUrl} 
              className="w-full h-full border-none" 
              allowFullScreen
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        ) : (
          <>
            <img 
              src={backdropUrl} 
              alt="Backdrop" 
              className="w-full h-full object-cover opacity-40 md:opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            
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
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${isTrailerPlaying ? 'mt-8 md:mt-8' : '-mt-16 md:-mt-32'}`}>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          
          {/* 🔥 POSTER FIX: Ab mobile par gayab nahi hoga! */}
          <div className="w-[50%] sm:w-1/3 md:w-1/4 lg:w-1/5 shrink-0 mx-auto md:mx-0 relative z-20">
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-full rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-gray-800"
            />
          </div>

          {/* TEXT & INFO (Mobile par Center, Desktop par Left) */}
          <div className={`flex flex-col items-center md:items-start text-center md:text-left justify-end w-full ${isTrailerPlaying ? 'pt-0 md:pt-4' : 'pt-2 md:pt-20 lg:pt-32'}`}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 text-white drop-shadow-lg">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-4 text-xs md:text-base text-gray-300 mb-5 font-medium">
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
              <div className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-[10px] md:text-xs font-bold text-red-400 uppercase tracking-wider">
                {movie.category}
              </div>
              <div className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-wider">
                {movie.language}
              </div>
            </div>

            {movie.genres && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6 w-full">
                {movie.genres.split(',').map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800/80 border border-gray-700 rounded-full text-[10px] md:text-sm font-semibold text-gray-300">
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* 🔥 PLAY FULL MOVIE BUTTON */}
            <div className="mb-8 w-full md:w-auto flex justify-center md:justify-start">
              <button 
                onClick={() => navigate(`/play/${movie._id}`)} 
                className="flex items-center justify-center gap-3 w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-lg font-bold text-sm md:text-base transition transform hover:-translate-y-1 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              >
                <Play size={20} fill="white" />
                PLAY FULL MOVIE
              </button>
            </div>

            <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-4xl mb-8 px-2 md:px-0">
              {movie.description || tmdbDetails?.overview || "Is movie ki description abhi tak mojud nahi hai."}
            </p>

            {/* CAST SECTION */}
            {cast.length > 0 && (
              <div className="mt-4 w-full">
                <h3 className="text-xl font-bold mb-4 border-l-4 border-red-600 pl-3 text-left">Top Cast</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                  {cast.map(actor => (
                    <div key={actor.id} className="flex flex-col items-center w-20 md:w-24 shrink-0">
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-800 border border-gray-700 mb-2 shadow-lg">
                        {actor.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                            alt={actor.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-[10px] md:text-xs text-center p-2">No Image</div>
                        )}
                      </div>
                      <span className="text-white text-[10px] md:text-sm font-semibold text-center leading-tight truncate w-full">{actor.name}</span>
                      <span className="text-gray-500 text-[9px] md:text-xs text-center leading-tight truncate w-full mt-0.5">{actor.character}</span>
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