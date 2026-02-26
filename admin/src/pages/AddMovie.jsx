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

  // Tumhari TMDB API Key
  const TMDB_API_KEY = "944a4dcfa30d2998783dd7ba8ba5c664";

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  // === MAGIC FUNCTION: IMDB ID se Pura Data Nikaalo ===
  const fetchTMDBDetails = async () => {
    if (!movie.imdbId) {
      toast.warning("Pehle IMDB ID likhein! ⚠️");
      return;
    }

    setFetchingData(true);
    try {
      // TMDB API URL (IMDB ID se search karne ke liye)
      const tmdbUrl = `https://api.themoviedb.org/3/find/${movie.imdbId}?external_source=imdb_id&api_key=${TMDB_API_KEY}`;
      const res = await axios.get(tmdbUrl);

      // Agar movie mil jaye
      if (res.data.movie_results && res.data.movie_results.length > 0) {
        const tmdbMovie = res.data.movie_results[0];

        // TMDB sirf aadhi image ka link deta hai, humein baaki khud lagana parta hai
        const fullPosterUrl = tmdbMovie.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
          : '';

        // Release date se sirf Saal (Year) nikalna
        const releaseYear = tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : 2026;

        // Form ko Auto-Fill kardo
        setMovie({
          ...movie,
          title: tmdbMovie.title || '',
          posterUrl: fullPosterUrl,
          description: tmdbMovie.overview || '',

          year: releaseYear,
          // Agar movie Hindi hai to 'Hindi' likho, warna baqi sab ko 'Dual Audio' kardo
          language: tmdbMovie.original_language === 'hi' ? 'Hindi' : 'Dual Audio'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tumhara Vercel wala Live Backend URL use hoga (Environment Variable se)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/movies/add`, movie);

      if (response.status === 201) {
        toast.success("Movie Added Successfully! 🚀");
        setMovie({
          title: '', posterUrl: '', imdbId: '', description: '', year: 2026, language: 'Hindi'
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

        {/* IMDB ID Input & Fetch Button (SABSE UPAR) */}
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
              disabled={fetchingData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold whitespace-nowrap"
            >
              {fetchingData ? "Fetching..." : "Fetch Auto Data ✨"}
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-900 border border-yellow-600 rounded">
          <label className="block text-yellow-500 mb-1 font-bold">Custom Player URL (Optional)</label>
          <p className="text-xs text-gray-400 mb-2">Agar movie VidSrc par nahi hai, to StreamWish/DoodStream ka Embed link yahan dalein. (Agar yeh bharenge, to VidSrc bypass ho jayega).</p>
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
          <input
            type="text" name="title" required
            value={movie.title} onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
          />
        </div>

        {/* Poster */}
        <div>
          <label className="block text-gray-400 mb-1">Poster URL</label>
          <input
            type="text" name="posterUrl" required
            value={movie.posterUrl} onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
          />
        </div>

        {/* Year & Language */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">Year</label>
            <input
              type="number" name="year"
              value={movie.year} onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">Language</label>
            <select
              name="language" value={movie.language} onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
            >
              <option>Hindi</option>
              <option>English</option>
              <option>Dual Audio</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-400 mb-1">Description</label>
          <textarea
            name="description" rows="5"
            value={movie.description} onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-4 font-bold text-white rounded transition ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {loading ? "Saving to Database..." : "Add Movie to Website"}
        </button>

      </form>
    </div>
  );
};

export default AddMovie;