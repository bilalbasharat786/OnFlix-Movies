import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddMovie = () => {
  const [movie, setMovie] = useState({
    title: '',
    posterUrl: '',
    imdbId: '',
    customUrl: '',
    year: new Date().getFullYear(),
    language: 'Hindi',
    category: 'Bollywood',
    genres: '',
    rating: '' 
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  
  // === 🔥 BULK IMPORT STATES ===
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState("");
  // 🔥 NAYA STATE: Auto-fetch ke liye selected year (Default 2024 rakha hai)
  const [selectedBulkYear, setSelectedBulkYear] = useState(2024);

  const TMDB_API_KEY = "944a4dcfa30d2998783dd7ba8ba5c664";

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  // === SMART MAGIC FUNCTION (Single Movie Manual Fetch) ===
  const fetchTMDBDetails = async () => {
    if (!movie.imdbId) {
      toast.warning("Pehle IMDB ID likhein! ⚠️");
      return;
    }

    setFetchingData(true);
    try {
      const tmdbUrl = `https://api.themoviedb.org/3/find/${movie.imdbId}?external_source=imdb_id&api_key=${TMDB_API_KEY}`;
      const res = await axios.get(tmdbUrl);

      if (res.data.movie_results && res.data.movie_results.length > 0) {
        const tmdbMovie = res.data.movie_results[0];

        const detailUrl = `https://api.themoviedb.org/3/movie/${tmdbMovie.id}?api_key=${TMDB_API_KEY}`;
        const detailRes = await axios.get(detailUrl);
        const fullMovieData = detailRes.data;

        const fullPosterUrl = tmdbMovie.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
          : '';
        const releaseYear = tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : new Date().getFullYear();

        const fetchedGenres = fullMovieData.genres ? fullMovieData.genres.map(g => g.name).join(', ') : '';
        const fetchedRating = fullMovieData.vote_average ? fullMovieData.vote_average.toFixed(1) : '';

        const ogLang = tmdbMovie.original_language;
        let autoCategory = 'Bollywood';
        let autoLanguage = 'Hindi';

        if (ogLang === 'en') {
            autoCategory = 'Hollywood';
            autoLanguage = 'Dual Audio';
        } else if (['te', 'ta', 'ml', 'kn'].includes(ogLang)) {
            autoCategory = 'Tollywood';
            autoLanguage = 'Hindi Dubbed';
        }

        setMovie({
          ...movie,
          title: tmdbMovie.title || '',
          posterUrl: fullPosterUrl,
          year: releaseYear,
          language: autoLanguage, 
          category: autoCategory,
          genres: fetchedGenres, 
          rating: fetchedRating  
        });

        toast.success(`Magic! ✨ ${autoCategory} Movie Data Auto-Filled!`);
      } else {
        toast.error("Is ID ki movie TMDB par nahi mili ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Data laane mein masla aya ❌");
    } finally {
      setFetchingData(false);
    }
  };

  // === 🚀 VIP MAGIC FUNCTION: Auto-Fetch Top 50 Bollywood Movies (Dynamic Year) ===
  const autoFetchTop50 = async () => {
    // 🔥 Ab message mein selected year aayega
    const confirmImport = window.confirm(`Kya aap waqai ${selectedBulkYear} ki Top 50 Bollywood movies automatically add karna chahte hain? Isme 1-2 minute lag sakte hain!`);
    if (!confirmImport) return;

    setBulkLoading(true);
    let addedCount = 0;

    try {
      for (let page = 1; page <= 5; page++) {
        setBulkProgress(`TMDB se Page ${page} ki movies dhoondh raha hoon...`);
        
        // 🔥 JADU: API call mein ab 'selectedBulkYear' use ho raha hai
        const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=hi&primary_release_year=${selectedBulkYear}&sort_by=popularity.desc&page=${page}`;
        const res = await axios.get(discoverUrl);
        const moviesList = res.data.results;

        for (const tmdbMovie of moviesList) {
          try {
            const detailUrl = `https://api.themoviedb.org/3/movie/${tmdbMovie.id}?api_key=${TMDB_API_KEY}`;
            const detailRes = await axios.get(detailUrl);
            const fullMovieData = detailRes.data; 
            const imdbId = fullMovieData.imdb_id;

            if (!imdbId) continue;

            const fullPosterUrl = fullMovieData.poster_path ? `https://image.tmdb.org/t/p/w500${fullMovieData.poster_path}` : '';
            // 🔥 Naye movies ke form mein bhi wahi selected year save hoga agar tmdb date nahi deta
            const releaseYear = fullMovieData.release_date ? fullMovieData.release_date.split('-')[0] : selectedBulkYear;
            
            const fetchedGenres = fullMovieData.genres ? fullMovieData.genres.map(g => g.name).join(', ') : '';
            const fetchedRating = fullMovieData.vote_average ? fullMovieData.vote_average.toFixed(1) : '';

            const newMovieData = {
              title: fullMovieData.title || '',
              posterUrl: fullPosterUrl,
              imdbId: imdbId,
              customUrl: '',
              year: releaseYear,
              language: 'Hindi', 
              category: 'Bollywood', 
              genres: fetchedGenres, 
              rating: fetchedRating  
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/movies/add`, newMovieData);
            addedCount++;
            setBulkProgress(`Abhi tak ${addedCount} movies automatically add ho gayin hain... 🚀`);
            
          } catch (err) {
            console.error(`Movie add karne mein masla (${tmdbMovie.title}):`, err);
          }
        }
      }
      toast.success(`🎉 Kamal ho gaya! ${selectedBulkYear} ki Total ${addedCount} Bollywood Movies database mein save ho gayin!`);
    } catch (error) {
      console.error("Bulk Fetching mein error aya:", error);
      toast.error("Auto Fetch ruk gaya, check console! ❌");
    } finally {
      setBulkLoading(false);
      setBulkProgress("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/movies/add`, movie);

      if (response.status === 201) {
        toast.success("Movie Added Successfully! 🚀");
        setMovie({
          title: '', posterUrl: '', imdbId: '', customUrl: '', year: new Date().getFullYear(), language: 'Hindi', category: 'Bollywood', genres: '', rating: '' 
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding movie ❌");
    } finally {
      setLoading(false);
    }
  };

  // Dropdown ke liye saalo ki list (2000 se current year tak)
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white flex justify-between items-center">
        <span>Add New Movie</span>
      </h2>

      {/* === 🔥 VIP AUTO FETCH BUTTON (With Dropdown) === */}
      <div className="mb-8 p-4 bg-gray-900 border-2 border-dashed border-red-500 rounded-lg text-center">
        <h3 className="text-xl text-red-500 font-bold mb-2">🔥 Auto-Import Magic</h3>
        <p className="text-sm text-gray-400 mb-4">Click karte hi selected saal ki top Bollywood movies aapke database mein khud add ho jayengi!</p>
        
        {/* 🔥 JADU: Naya Dropdown aur Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <select 
            value={selectedBulkYear}
            onChange={(e) => setSelectedBulkYear(e.target.value)}
            disabled={bulkLoading || loading}
            className="w-full sm:w-1/3 p-3 bg-gray-800 text-white rounded font-bold border border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            {yearsList.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={autoFetchTop50}
            disabled={bulkLoading || loading}
            className={`w-full sm:w-2/3 py-3 font-bold text-white rounded shadow-lg transition-all ${bulkLoading ? 'bg-gray-600 cursor-not-allowed animate-pulse' : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700'}`}
          >
            {bulkLoading ? `Rukiye... ${bulkProgress}` : `🚀 Auto-Fetch Top Movies (${selectedBulkYear})`}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <hr className="flex-1 border-gray-600" />
        <span className="text-gray-400 font-bold">OR ADD MANUALLY</span>
        <hr className="flex-1 border-gray-600" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Yahan se neechay wala hissa aapke pichlay code ka same hai */}
        <div>
          <label className="block text-gray-400 mb-1">1. Paste IMDB ID First</label>
          <div className="flex gap-2">
            <input type="text" name="imdbId" required value={movie.imdbId} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500" placeholder="e.g. tt12844910" />
            <button type="button" onClick={fetchTMDBDetails} disabled={fetchingData || bulkLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold whitespace-nowrap">
              {fetchingData ? "Fetching..." : "Fetch Auto Data ✨"}
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-900 border border-yellow-600 rounded">
          <label className="block text-yellow-500 mb-1 font-bold">Custom Player URL (Optional)</label>
          <input type="text" name="customUrl" value={movie.customUrl} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-yellow-500" placeholder="e.g. https://streamwish.to/e/xyz123" />
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Movie Title</label>
          <input type="text" name="title" required value={movie.title} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Poster URL</label>
          <input type="text" name="posterUrl" required value={movie.posterUrl} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-gray-400 mb-1">Year</label>
            <input type="number" name="year" value={movie.year} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-gray-400 mb-1 font-bold text-red-400">Category</label>
            <select name="category" value={movie.category} onChange={handleChange} className="w-full p-2 bg-gray-800 text-white rounded border border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500">
              <option>Bollywood</option>
              <option>Hollywood</option>
              <option>Tollywood</option>
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-gray-400 mb-1">Language Display</label>
            <select name="language" value={movie.language} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600">
              <option>Hindi</option>
              <option>English</option>
              <option>Dual Audio</option>
              <option>Hindi Dubbed</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <div className="w-full md:w-2/3">
            <label className="block text-gray-400 mb-1">Genres (e.g. Action, Comedy)</label>
            <input type="text" name="genres" value={movie.genres} onChange={handleChange} placeholder="Action, Thriller, Romance..." className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-gray-400 mb-1">Rating (e.g. 8.5)</label>
            <input type="text" name="rating" value={movie.rating} onChange={handleChange} placeholder="8.5" className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
          </div>
        </div>

        <button type="submit" disabled={loading || bulkLoading} className={`w-full py-3 mt-4 font-bold text-white rounded transition ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
          {loading ? "Saving to Database..." : "Add Movie to Website"}
        </button>

      </form>
    </div>
  );
};

export default AddMovie;