import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ManageMovies({ categoryTitle }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Modal aur Form ke liye states
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', posterUrl: '', imdbId: '', customUrl: '', description: '', year: '', language: '' 
  });

  // Tumhara Live Vercel/Render Backend URL environment variable se
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // 1. Movies Fetch Karne Ka Function
  const fetchMovies = async () => {
    try {
      console.log(`\n===========================================`);
      console.log(`🚀 [FETCH INIT] ${categoryTitle} ki movies load ho rahi hain...`);
      setLoading(true);
      
      const response = await axios.get(`${API_BASE_URL}/api/movies/all`);
      console.log(`✅ [FETCH SUCCESS] Backend se total ${response.data.length} movies aayin:`, response.data);

      // Smart Filtering: Language ke hisaab se Bollywood / Hollywood alag karna
      const filteredMovies = response.data.filter((movie) => {
        if (categoryTitle.toLowerCase().includes("bollywood")) {
          return movie.language === 'Hindi';
        } else {
          return movie.language === 'English' || movie.language === 'Dual Audio';
        }
      });
      
      console.log(`🎯 [FILTERED DATA] Sirf ${categoryTitle} ki ${filteredMovies.length} movies:`, filteredMovies);
      setMovies(filteredMovies);
      setLoading(false);

    } catch (error) {
      console.error("❌ [FETCH ERROR] Movies laane mein masla:", error);
      toast.error("Movies load nahi ho rahin! Console check karein.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [categoryTitle]);

  // 2. Edit Button Par Click Karne Ka Function
  const handleEditClick = (movie) => {
    console.log(`\n✏️ [EDIT CLICKED] User ne is movie ko update karne ke liye chuna:`, movie);
    setEditingMovie(movie._id);
    
    // Form ko purane data se auto-fill karna
    setFormData({ 
      title: movie.title || '', 
      posterUrl: movie.posterUrl || '', 
      imdbId: movie.imdbId || '', 
      customUrl: movie.customUrl || '', 
      description: movie.description || '', 
      year: movie.year || '', 
      language: movie.language || 'Hindi' 
    });
  };

  // 3. Form Submit / Update Karne Ka Function
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(`\n📤 [UPDATE INIT] Movie ID ${editingMovie} ko update bheja ja raha hai...`);
    console.log(`📦 [UPDATE PAYLOAD] Naya data yeh hai:`, formData);

    try {
      const response = await axios.put(`${API_BASE_URL}/api/movies/${editingMovie}`, formData);
      console.log(`✅ [UPDATE SUCCESS] Backend response:`, response.data);
      
      toast.success("Movie Successfully Update Ho Gayi! 🎉");
      setEditingMovie(null); // Form (Modal) band kar do
      fetchMovies(); // List ko dubara refresh kardo taake updated data nazar aaye
    } catch (error) {
      console.error("❌ [UPDATE ERROR] Update fail ho gaya. Details:", error);
      toast.error("Movie update fail! Console mein error dekho.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-black mb-8 text-white border-b border-gray-700 pb-4">
        Manage <span className="text-red-600">{categoryTitle}</span> Movies
      </h2>

      {/* === EDIT MOVIE MODAL / FORM === */}
      {editingMovie && (
        <div className="bg-gray-800 p-8 rounded-xl mb-10 border border-red-900/50 shadow-2xl relative">
          <button 
            onClick={() => setEditingMovie(null)} 
            className="absolute top-4 right-6 text-gray-400 hover:text-red-500 font-bold text-2xl"
          >
            ✕
          </button>
          
          <h3 className="text-2xl text-white font-bold mb-6">Edit Movie: <span className="text-red-500">{formData.title}</span></h3>
          
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Movie Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500" />
            </div>

            {/* IMDB ID */}
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">IMDB ID</label>
              <input type="text" value={formData.imdbId} onChange={(e) => setFormData({...formData, imdbId: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500" />
            </div>

            {/* Custom URL */}
            <div className="md:col-span-2 p-4 bg-gray-900 border border-yellow-600/50 rounded">
              <label className="block text-yellow-500 mb-1 font-bold">Custom Player URL (Embed Link)</label>
              <input type="text" value={formData.customUrl} onChange={(e) => setFormData({...formData, customUrl: e.target.value})} placeholder="https://streamwish.to/e/..." className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-yellow-500" />
            </div>

            {/* Year & Language */}
            <div className="flex gap-4 md:col-span-2">
              <div className="w-1/2">
                <label className="block text-gray-400 mb-1 font-semibold">Year</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500" />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-400 mb-1 font-semibold">Language</label>
                <select value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500">
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Dual Audio</option>
                </select>
              </div>
            </div>

            {/* Poster URL */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-1 font-semibold">Poster URL</label>
              <input type="text" value={formData.posterUrl} onChange={(e) => setFormData({...formData, posterUrl: e.target.value})} required className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500" />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-1 font-semibold">Description</label>
              <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"></textarea>
            </div>
            
            {/* Submit Buttons */}
            <div className="flex gap-4 md:col-span-2 mt-4">
              <button type="submit" className="w-full bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 font-bold transition shadow-lg">Save Changes</button>
              <button type="button" onClick={() => setEditingMovie(null)} className="w-1/3 bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-500 font-bold transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* === MOVIES LIST GRID === */}
      {loading ? (
        <div className="text-center text-red-500 text-xl font-bold py-10 animate-pulse">Movies load ho rahi hain...</div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-400 text-xl font-semibold py-10 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800">
          Is category mein koi movies nahi mili. Pehle Add Movie mein ja kar movies dalein!
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col shadow-lg border border-gray-700 relative">
              
              {/* Language Tag */}
              <div className="absolute top-2 right-2 bg-red-600/90 px-2 py-1 rounded text-xs text-white font-bold z-10">
                {movie.language}
              </div>

              {/* Poster */}
              <div className="h-64 w-full overflow-hidden bg-gray-900">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                )}
              </div>
              
              {/* Details & Button */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white leading-tight mb-1 truncate" title={movie.title}>{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{movie.year}</p>
                
                <button 
                  onClick={() => handleEditClick(movie)} 
                  className="mt-auto bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 font-bold transition flex justify-center items-center gap-2"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}