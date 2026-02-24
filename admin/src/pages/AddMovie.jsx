import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddMovie = () => {
  const [movie, setMovie] = useState({
    title: '',
    posterUrl: '',
    imdbId: '',
    customUrl: '',
    description: '',
    year: new Date().getFullYear(),
    language: 'Hindi'
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  
  // === NAYI STATES: Bulk Import ke liye ===
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState("");

  // Tumhari TMDB API Key
  const TMDB_API_KEY = "944a4dcfa30d2998783dd7ba8ba5c664";

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  // === MAGIC FUNCTION: IMDB ID se Pura Data Nikaalo (Purana Manual Wala) ===
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

        const fullPosterUrl = tmdbMovie.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
          : '';

        const releaseYear = tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : 2026;

        setMovie({
          ...movie,
          title: tmdbMovie.title || '',
          posterUrl: fullPosterUrl,
          description: tmdbMovie.overview || '',
          year: releaseYear,
          language: tmdbMovie.original_language === 'hi' ? 'Hindi' : tmdbMovie.original_language === 'en' ? 'English' : 'Dual Audio'
        });

        toast.success("Magic! ✨ Movie Data Auto-Filled!");
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

  // === VIP MAGIC FUNCTION: Auto-Fetch Top 20 Bollywood Movies 🚀 ===
  const autoFetchTop20 = async () => {
    // User se permission lena taake ghalti se click na ho jaye
    const confirmImport = window.confirm("Kya aap waqai 2025 ki Top 20 Bollywood movies automatically add karna chahte hain? Isme 1-2 minute lag sakte hain aur tab ko band mat kijiye ga!");
    if (!confirmImport) return;

    setBulkLoading(true);
    let addedCount = 0;

    try {
      // 5 Pages loop chalega (Har page par 20 movies = 20 movies total)
      for (let page = 1; page <= 5; page++) {
        setBulkProgress(`TMDB se Page ${page} ki movies dhoondh raha hoon...`);
        
        // TMDB Discover API: Language=hi (Hindi), Year=2025, Sorted by Popularity
        const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=hi&primary_release_year=2025&sort_by=popularity.desc&page=${page}`;
        const res = await axios.get(discoverUrl);
        const moviesList = res.data.results;

        // Ab har movie ke andar ja kar IMDB ID nikalenge aur database mein bhejenge
        for (const tmdbMovie of moviesList) {
          try {
            // IMDB ID laane ke liye dobara call
            const detailUrl = `https://api.themoviedb.org/3/movie/${tmdbMovie.id}?api_key=${TMDB_API_KEY}`;
            const detailRes = await axios.get(detailUrl);
            const imdbId = detailRes.data.imdb_id;

            // Agar kisi movie ka IMDB ID nahi hai, to usay chhor do (kyunke VidSrc nahi chalega)
            if (!imdbId) continue;

            const fullPosterUrl = tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : '';
            const releaseYear = tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : 2025;

            // Pura form data ready karo
            const newMovieData = {
              title: tmdbMovie.title || '',
              posterUrl: fullPosterUrl,
              imdbId: imdbId,
              customUrl: '',
              description: tmdbMovie.overview || '',
              year: releaseYear,
              language: 'Hindi'
            };

            // Tumhare Vercel wale Live Backend par auto-send!
            await axios.post(`${import.meta.env.VITE_API_URL}/api/movies/add`, newMovieData);
            addedCount++;
            setBulkProgress(`Abhi tak ${addedCount} movies automatically add ho gayin hain... 🚀`);
            
          } catch (err) {
            console.error(`Movie add karne mein masla (${tmdbMovie.title}):`, err);
            // Agar ek fail ho jaye to loop nahi rukega, agli movie par chala jayega
          }
        }
      }
      toast.success(`🎉 Kamal ho gaya! Total ${addedCount} Bollywood Movies database mein save ho gayin!`);
    } catch (error) {
      console.error("Bulk Fetching mein error aya:", error);
      toast.error("Auto Fetch ruk gaya, check console! ❌");
    } finally {
      setBulkLoading(false);
      setBulkProgress("");
    }
  };

  // Normal Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/movies/add`, movie);

      if (response.status === 201) {
        toast.success("Movie Added Successfully! 🚀");
        setMovie({
          title: '', posterUrl: '', imdbId: '', customUrl: '', description: '', year: 2026, language: 'Hindi'
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding movie ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white flex justify-between items-center">
        <span>Add New Movie</span>
      </h2>

      {/* === VIP AUTO FETCH BUTTON === */}
      <div className="mb-8 p-4 bg-gray-900 border-2 border-dashed border-red-500 rounded-lg text-center">
        <h3 className="text-xl text-red-500 font-bold mb-2">🔥 Auto-Import Magic</h3>
        <p className="text-sm text-gray-400 mb-4">Click karte hi 2025 ki top 20 Bollywood movies tmdb se aapke database mein khud add ho jayengi!</p>
        <button
          onClick={autoFetchTop20}
          disabled={bulkLoading || loading}
          className={`w-full py-3 font-bold text-white rounded shadow-lg transition-all ${bulkLoading ? 'bg-gray-600 cursor-not-allowed animate-pulse' : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700'}`}
        >
          {bulkLoading ? `Rukiye... ${bulkProgress}` : "🚀 Auto-Fetch Top 20 Bollywood Movies (2025)"}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <hr className="flex-1 border-gray-600" />
        <span className="text-gray-400 font-bold">OR ADD MANUALLY</span>
        <hr className="flex-1 border-gray-600" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* IMDB ID Input & Fetch Button */}
        <div>
          <label className="block text-gray-400 mb-1">1. Paste IMDB ID First</label>
          <div className="flex gap-2">
            <input
              type="text" name="imdbId" required
              value={movie.imdbId} onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
              placeholder="e.g. tt12844910"
            />
            <button
              type="button"
              onClick={fetchTMDBDetails}
              disabled={fetchingData || bulkLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold whitespace-nowrap"
            >
              {fetchingData ? "Fetching..." : "Fetch Auto Data ✨"}
            </button>
          </div>
        </div>

        {/* Custom Player URL */}
        <div className="p-4 bg-gray-900 border border-yellow-600 rounded">
          <label className="block text-yellow-500 mb-1 font-bold">Custom Player URL (Optional)</label>
          <p className="text-xs text-gray-400 mb-2">Agar movie VidSrc par nahi hai, to StreamWish/Telegram ka Embed link yahan dalein.</p>
          <input
            type="text" name="customUrl"
            value={movie.customUrl} onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-yellow-500"
            placeholder="e.g. https://streamwish.to/e/xyz123"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-400 mb-1">Movie Title</label>
          <input type="text" name="title" required value={movie.title} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
        </div>

        {/* Poster */}
        <div>
          <label className="block text-gray-400 mb-1">Poster URL</label>
          <input type="text" name="posterUrl" required value={movie.posterUrl} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
        </div>

        {/* Year & Language */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">Year</label>
            <input type="number" name="year" value={movie.year} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">Language</label>
            <select name="language" value={movie.language} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600">
              <option>Hindi</option><option>English</option><option>Dual Audio</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-400 mb-1">Description</label>
          <textarea name="description" rows="5" value={movie.description} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"></textarea>
        </div>

        <button type="submit" disabled={loading || bulkLoading} className={`w-full py-3 mt-4 font-bold text-white rounded transition ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
          {loading ? "Saving to Database..." : "Add Movie to Website"}
        </button>

      </form>
    </div>
  );
};

export default AddMovie;