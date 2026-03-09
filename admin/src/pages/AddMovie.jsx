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
    rating: '',
    isHero: false
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  
  // === 🔥 BULK IMPORT STATES ===
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState("");
  const [selectedBulkYear, setSelectedBulkYear] = useState(new Date().getFullYear());
  
  // 🔥 NAYE STATES: Custom Count aur Region ke liye
  const [selectedMovieCount, setSelectedMovieCount] = useState(20);
  const [selectedRegion, setSelectedRegion] = useState('hi'); // Default: Hindi (Bollywood)

  const TMDB_API_KEY = "944a4dcfa30d2998783dd7ba8ba5c664";

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setMovie({ ...movie, [e.target.name]: value });
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
        } else if (ogLang === 'ko') {
            autoCategory = 'K-Drama';
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

  // === 🚀 VIP MAGIC FUNCTION: Auto-Fetch Top Movies (With Rating Filter) ===
  const autoFetchTopMovies = async () => {
    // Dropdown se selected region ka naam nikalne ke liye for alert
    const regionNames = { 'hi': 'Bollywood', 'en': 'Hollywood', 'te': 'Tollywood (Telugu)', 'ta': 'Tollywood (Tamil)', 'ko': 'South Korean' };
    const regionName = regionNames[selectedRegion] || 'Movies';

    const confirmImport = window.confirm(`Kya aap waqai ${selectedBulkYear} ki Top ${selectedMovieCount} ${regionName} movies (Sirf 5.0+ Rating wali) add karna chahte hain?`);
    if (!confirmImport) return;

    setBulkLoading(true);
    let addedCount = 0;
    let skippedCount = 0; // Low rating wali kitni skip huin

    // Har page par 20 movies hoti hain, is liye hum count ke hisaab se pages loop karenge
    const pagesToFetch = Math.ceil(selectedMovieCount / 20);

    try {
      for (let page = 1; page <= pagesToFetch; page++) {
        setBulkProgress(`TMDB se Page ${page}/${pagesToFetch} ki movies dhoondh raha hoon...`);
        
        // 🔥 JADU: API mein Region (with_original_language) aur Year dono pass kiye hain
        const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${selectedRegion}&primary_release_year=${selectedBulkYear}&sort_by=popularity.desc&page=${page}`;
        const res = await axios.get(discoverUrl);
        const moviesList = res.data.results;

        for (const tmdbMovie of moviesList) {
          // Agar desired count poora ho jaye toh loop break kar do
          if (addedCount >= selectedMovieCount) break;

          try {
            // 🔥 NAYA LOGIC: Low Rating Filter (5.0 se kam skip kar do)
            if (!tmdbMovie.vote_average || tmdbMovie.vote_average < 5.0) {
              skippedCount++;
              continue; 
            }

            const detailUrl = `https://api.themoviedb.org/3/movie/${tmdbMovie.id}?api_key=${TMDB_API_KEY}`;
            const detailRes = await axios.get(detailUrl);
            const fullMovieData = detailRes.data; 
            const imdbId = fullMovieData.imdb_id;

            if (!imdbId) continue;

            const fullPosterUrl = fullMovieData.poster_path ? `https://image.tmdb.org/t/p/w500${fullMovieData.poster_path}` : '';
            const releaseYear = fullMovieData.release_date ? fullMovieData.release_date.split('-')[0] : selectedBulkYear;
            
            const fetchedGenres = fullMovieData.genres ? fullMovieData.genres.map(g => g.name).join(', ') : '';
            const fetchedRating = fullMovieData.vote_average ? fullMovieData.vote_average.toFixed(1) : '';

            // Auto-detect Category & Language based on Region
            let autoCategory = 'Bollywood';
            let autoLanguage = 'Hindi';
            if (selectedRegion === 'en') { autoCategory = 'Hollywood'; autoLanguage = 'Dual Audio'; }
            else if (['te', 'ta'].includes(selectedRegion)) { autoCategory = 'Tollywood'; autoLanguage = 'Hindi Dubbed'; }
            else if (selectedRegion === 'ko') { autoCategory = 'K-Drama'; autoLanguage = 'Hindi Dubbed'; }

            const newMovieData = {
              title: fullMovieData.title || '',
              posterUrl: fullPosterUrl,
              imdbId: imdbId,
              customUrl: '',
              year: releaseYear,
              language: autoLanguage, 
              category: autoCategory, 
              genres: fetchedGenres, 
              rating: fetchedRating  
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/movies/add`, newMovieData);
            addedCount++;
            setBulkProgress(`Abhi tak ${addedCount} high-rated movies add ho gayin hain... 🚀`);
            
          } catch (err) {
            console.error(`Movie add karne mein masla (${tmdbMovie.title}):`, err);
          }
        }
      }
      toast.success(`🎉 Kamal ho gaya! Total ${addedCount} High-Rated Movies add huin. (${skippedCount} bekar movies skip ki gayin!)`);
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
          title: '', posterUrl: '', imdbId: '', customUrl: '', year: new Date().getFullYear(), language: 'Hindi', category: 'Bollywood', genres: '', rating: '', isHero: false 
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding movie ❌");
    } finally {
      setLoading(false);
    }
  };

  // Dropdown lists
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
  const countsList = [20, 40, 60, 80, 100];
  const regionsList = [
    { code: 'hi', name: 'Bollywood (Hindi)' },
    { code: 'en', name: 'Hollywood (English)' },
    { code: 'te', name: 'Tollywood (Telugu)' },
    { code: 'ta', name: 'Tollywood (Tamil)' },
    { code: 'ko', name: 'South Korean (K-Drama)' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-4 md:p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white flex justify-between items-center">
        <span>Add New Movie</span>
      </h2>

      {/* === 🔥 VIP AUTO FETCH BOX (Fully Responsive) === */}
      <div className="mb-8 p-4 bg-gray-900 border-2 border-dashed border-red-500 rounded-lg">
        <h3 className="text-lg md:text-xl text-red-500 font-bold mb-2 text-center">🔥 Auto-Import Magic</h3>
        <p className="text-xs md:text-sm text-gray-400 mb-4 text-center">Sirf 5.0+ rating wali premium movies automatically add karein!</p>
        
        {/* Naye Filters Row (Grid System for Mobile & Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          
          {/* 1. Region Selector */}
          <div>
            <label className="block text-gray-400 text-xs mb-1">Industry / Region</label>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              disabled={bulkLoading || loading}
              className="w-full p-2.5 bg-gray-800 text-white rounded font-medium border border-gray-600 focus:outline-none focus:border-red-500 text-sm"
            >
              {regionsList.map(r => (
                <option key={r.code} value={r.code}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Year Selector */}
          <div>
            <label className="block text-gray-400 text-xs mb-1">Release Year</label>
            <select 
              value={selectedBulkYear}
              onChange={(e) => setSelectedBulkYear(e.target.value)}
              disabled={bulkLoading || loading}
              className="w-full p-2.5 bg-gray-800 text-white rounded font-medium border border-gray-600 focus:outline-none focus:border-red-500 text-sm"
            >
              {yearsList.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* 3. Count Selector */}
          <div>
            <label className="block text-gray-400 text-xs mb-1">Max Movies to Add</label>
            <select 
              value={selectedMovieCount}
              onChange={(e) => setSelectedMovieCount(Number(e.target.value))}
              disabled={bulkLoading || loading}
              className="w-full p-2.5 bg-gray-800 text-white rounded font-medium border border-gray-600 focus:outline-none focus:border-red-500 text-sm"
            >
              {countsList.map(c => (
                <option key={c} value={c}>{c} Movies</option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={autoFetchTopMovies}
          disabled={bulkLoading || loading}
          className={`w-full py-3 font-bold text-white rounded shadow-lg transition-all ${bulkLoading ? 'bg-gray-600 cursor-not-allowed animate-pulse' : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700'}`}
        >
          {bulkLoading ? `Rukiye... ${bulkProgress}` : `🚀 Fetch ${selectedMovieCount} High-Rated Movies`}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <hr className="flex-1 border-gray-600" />
        <span className="text-gray-400 text-sm font-bold">OR ADD MANUALLY</span>
        <hr className="flex-1 border-gray-600" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. IMDB Input */}
        <div>
          <label className="block text-gray-400 text-sm mb-1">1. Paste IMDB ID First</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" name="imdbId" required value={movie.imdbId} onChange={handleChange} className="w-full p-2.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500" placeholder="e.g. tt12844910" />
            <button type="button" onClick={fetchTMDBDetails} disabled={fetchingData || bulkLoading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded font-bold whitespace-nowrap transition">
              {fetchingData ? "Fetching..." : "Fetch Auto Data ✨"}
            </button>
          </div>
        </div>

        {/* 2. Custom URL */}
        <div className="p-4 bg-gray-900 border border-yellow-600 rounded">
          <label className="block text-yellow-500 text-sm mb-1 font-bold">Custom Player URL (Optional)</label>
          <input type="text" name="customUrl" value={movie.customUrl} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-yellow-500" placeholder="e.g. https://streamwish.to/e/xyz123" />
        </div>

        {/* 3. Title & Poster */}
        <div>
          <label className="block text-gray-400 text-sm mb-1">Movie Title</label>
          <input type="text" name="title" required value={movie.title} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Poster URL</label>
          <input type="text" name="posterUrl" required value={movie.posterUrl} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
        </div>

        {/* 4. Dropdowns Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-gray-400 text-sm mb-1">Year</label>
            <input type="number" name="year" value={movie.year} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm mb-1 font-bold text-red-400">Category</label>
            <select name="category" value={movie.category} onChange={handleChange} className="w-full p-2 bg-gray-800 text-white rounded border border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500">
              <option>Bollywood</option>
              <option>Hollywood</option>
              <option>Tollywood</option>
              <option>K-Drama</option>
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-gray-400 text-sm mb-1">Language Display</label>
            <select name="language" value={movie.language} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600">
              <option>Hindi</option>
              <option>English</option>
              <option>Dual Audio</option>
              <option>Hindi Dubbed</option>
            </select>
          </div>
        </div>

        {/* 5. Genres & Rating */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <label className="block text-gray-400 text-sm mb-1">Genres (e.g. Action, Comedy)</label>
            <input type="text" name="genres" value={movie.genres} onChange={handleChange} placeholder="Action, Thriller, Romance..." className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-gray-400 text-sm mb-1">Rating (e.g. 8.5)</label>
            <input type="text" name="rating" value={movie.rating} onChange={handleChange} placeholder="8.5" className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
          </div>
        </div>

        {/* 6. Hero Checkbox */}
        <div className="p-4 bg-gray-900 border border-red-500 rounded flex items-center gap-3">
          <input 
            type="checkbox" 
            name="isHero" 
            id="isHero" 
            checked={movie.isHero} 
            onChange={handleChange} 
            className="w-5 h-5 accent-red-600 cursor-pointer" 
          />
          <label htmlFor="isHero" className="text-white font-bold cursor-pointer select-none">
            Add to Hero Section
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading || bulkLoading} className={`w-full py-3 mt-4 font-bold text-white rounded transition ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
          {loading ? "Saving to Database..." : "Add Movie to Website"}
        </button>

      </form>
    </div>
  );
};

export default AddMovie;