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
    language: 'Hindi',
    category: 'Bollywood' // 🔥 Nayi State Default
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const TMDB_API_KEY = "944a4dcfa30d2998783dd7ba8ba5c664";

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  // === SMART MAGIC FUNCTION ===
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

        // 🔥 SMART AUTO-CATEGORY & LANGUAGE DETECTOR
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
          description: tmdbMovie.overview || '',
          year: releaseYear,
          language: autoLanguage, // Automatically set
          category: autoCategory  // Automatically set
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/movies/add`, movie);

      if (response.status === 201) {
        toast.success("Movie Added Successfully! 🚀");
        setMovie({
          title: '', posterUrl: '', imdbId: '', description: '', year: 2026, language: 'Hindi', category: 'Bollywood'
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
      <h2 className="text-2xl font-bold mb-6 text-white">Add New Movie</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-400 mb-1">1. Paste IMDB ID First</label>
          <div className="flex gap-2">
            <input type="text" name="imdbId" required value={movie.imdbId} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500" placeholder="e.g. tt12844910" />
            <button type="button" onClick={fetchTMDBDetails} disabled={fetchingData} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold whitespace-nowrap">
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

        {/* Year, Category & Language (3 Columns Ab) */}
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-gray-400 mb-1">Year</label>
            <input type="number" name="year" value={movie.year} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
          </div>
          
          {/* 🔥 NAYA DROPDOWN: Category */}
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

        <div>
          <label className="block text-gray-400 mb-1">Description</label>
          <textarea name="description" rows="5" value={movie.description} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"></textarea>
        </div>

        <button type="submit" disabled={loading} className={`w-full py-3 mt-4 font-bold text-white rounded transition ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
          {loading ? "Saving to Database..." : "Add Movie to Website"}
        </button>

      </form>
    </div>
  );
};

export default AddMovie;