import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddMovie = () => {
  // === CORRECTION 1: State mein 'streamUrl' hata kar 'imdbId' lagana hai ===
  const [movie, setMovie] = useState({
    title: '',
    posterUrl: '',
    imdbId: '', // <-- Ye change zaroori tha
    description: '',
    year: new Date().getFullYear(),
    language: 'Hindi'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
const response = await axios.post(`${import.meta.env.VITE_API_URL}/movies/add`, movie);
      
      if (response.status === 201) {
        toast.success("Movie Added Successfully! 🚀");
        // === CORRECTION 2: Reset karte waqt bhi 'imdbId' khaali karna hai ===
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
        
        {/* Title */}
        <div>
          <label className="block text-gray-400 mb-1">Movie Title</label>
          <input 
            type="text" name="title" required
            value={movie.title} onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
            placeholder="e.g. Pathaan"
          />
        </div>

        {/* Poster */}
        <div>
          <label className="block text-gray-400 mb-1">Poster URL</label>
          <input 
            type="text" name="posterUrl" required
            value={movie.posterUrl} onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
            placeholder="https://cloudinary..."
          />
        </div>

        {/* IMDB ID Input */}
        <div>
          <label className="block text-gray-400 mb-1">IMDB ID (e.g. tt1234567)</label>
          <input 
            type="text" name="imdbId" required // <-- Name 'imdbId' hona chahiye (Sahi tha)
            value={movie.imdbId} onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
            placeholder="Paste IMDB ID here (e.g. tt12844910)"
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
            name="description" rows="3"
            value={movie.description} onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 mt-4 font-bold text-white rounded transition ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {loading ? "Saving..." : "Add Movie"}
        </button>

      </form>
    </div>
  );
};

export default AddMovie;