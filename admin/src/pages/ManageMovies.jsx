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

  // === NAYI STATE: Preview Player (Check karne ke liye) ===
  const [previewLink, setPreviewLink] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // 1. Movies Fetch Karne Ka Function
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/movies/all`);

      // Smart Filtering: Language ke hisaab se Bollywood / Hollywood alag karna
      const filteredMovies = response.data.filter((movie) => {
        if (categoryTitle.toLowerCase().includes("bollywood")) {
          return movie.language === 'Hindi';
        } else {
          return movie.language === 'English' || movie.language === 'Dual Audio';
        }
      });
      
      setMovies(filteredMovies);
      setLoading(false);
    } catch (error) {
      console.error("❌ [FETCH ERROR]:", error);
      toast.error("Movies load nahi ho rahin! Console check karein.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [categoryTitle]);

  // 2. Edit Button Logic
  const handleEditClick = (movie) => {
    setEditingMovie(movie._id);
    setFormData({ 
      title: movie.title || '', posterUrl: movie.posterUrl || '', imdbId: movie.imdbId || '', 
      customUrl: movie.customUrl || '', description: movie.description || '', year: movie.year || '', language: movie.language || 'Hindi' 
    });
  };

  // 3. Update Logic
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/movies/${editingMovie}`, formData);
      toast.success("Movie Successfully Update Ho Gayi! 🎉");
      setEditingMovie(null); 
      fetchMovies(); 
    } catch (error) {
      console.error("❌ [UPDATE ERROR]:", error);
      toast.error("Movie update fail!");
    }
  };

  // 4. Video Preview Checker Logic
  const openPreview = (movie) => {
    // Agar customUrl hai to wo chalao, warna VidSrc ka link chala kar check karo
    const linkToCheck = movie.customUrl && movie.customUrl !== "" 
      ? movie.customUrl 
      : `https://vsembed.ru/embed/movie/${movie.imdbId}`;
    setPreviewLink(linkToCheck);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-black mb-8 text-white border-b border-gray-700 pb-4">
        Manage <span className="text-red-600">{categoryTitle}</span> Movies
      </h2>

      {/* === 🔴 LIVE PREVIEW MODAL (Video Checker) 🔴 === */}
      {previewLink && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-2xl relative">
            <div className="bg-gray-800 p-3 flex justify-between items-center">
              <span className="text-yellow-400 font-bold flex items-center gap-2">
                🔍 Testing Player Link
              </span>
              <button onClick={() => setPreviewLink(null)} className="text-white bg-red-600 hover:bg-red-700 px-4 py-1 rounded font-bold">
                Close Preview
              </button>
            </div>
            {/* Iframe to test the actual link */}
            <iframe 
              src={previewLink} 
              className="w-full h-[60vh] md:h-[70vh]" 
              frameBorder="0" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      )}

      {/* === EDIT MOVIE MODAL / FORM === */}
      {editingMovie && (
        <div className="bg-gray-800 p-8 rounded-xl mb-10 border border-red-900/50 shadow-2xl relative">
          <button onClick={() => setEditingMovie(null)} className="absolute top-4 right-6 text-gray-400 hover:text-red-500 font-bold text-2xl">✕</button>
          <h3 className="text-2xl text-white font-bold mb-6">Edit Movie: <span className="text-red-500">{formData.title}</span></h3>
          
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-gray-400 mb-1 font-semibold">Movie Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full p-3 bg-gray-700 text-white rounded focus:border-red-500" /></div>
            <div><label className="block text-gray-400 mb-1 font-semibold">IMDB ID</label><input type="text" value={formData.imdbId} onChange={(e) => setFormData({...formData, imdbId: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded focus:border-red-500" /></div>
            
            <div className="md:col-span-2 p-4 bg-gray-900 border border-yellow-600/50 rounded">
              <label className="block text-yellow-500 mb-1 font-bold">Custom Player URL (Agar VidSrc par movie na chalay)</label>
              <input type="text" value={formData.customUrl} onChange={(e) => setFormData({...formData, customUrl: e.target.value})} placeholder="Paste Telegram/Streamwish link here..." className="w-full p-3 bg-gray-700 text-white rounded focus:border-yellow-500" />
            </div>

            <div className="flex gap-4 md:col-span-2">
              <div className="w-1/2"><label className="block text-gray-400 mb-1 font-semibold">Year</label><input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required className="w-full p-3 bg-gray-700 text-white rounded focus:border-red-500" /></div>
              <div className="w-1/2"><label className="block text-gray-400 mb-1 font-semibold">Language</label>
                <select value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded focus:border-red-500">
                  <option>Hindi</option><option>English</option><option>Dual Audio</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2"><label className="block text-gray-400 mb-1 font-semibold">Poster URL</label><input type="text" value={formData.posterUrl} onChange={(e) => setFormData({...formData, posterUrl: e.target.value})} required className="w-full p-3 bg-gray-700 text-white rounded focus:border-red-500" /></div>
            <div className="md:col-span-2"><label className="block text-gray-400 mb-1 font-semibold">Description</label><textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded focus:border-red-500"></textarea></div>
            
            <div className="flex gap-4 md:col-span-2 mt-4">
              <button type="submit" className="w-full bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 font-bold transition shadow-lg">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* === MOVIES LIST GRID === */}
      {loading ? (
        <div className="text-center text-red-500 text-xl font-bold py-10 animate-pulse">Movies load ho rahi hain...</div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-400 text-xl font-semibold py-10 border border-gray-700 rounded-lg">Is category mein koi movies nahi mili.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => {
            
            // Checking: Is this using VidSrc or Custom?
            const isCustom = movie.customUrl && movie.customUrl !== "";

            return (
              <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col shadow-lg border border-gray-700 relative group">
                
                {/* 🔴 STATUS BADGE (VidSrc vs Custom) */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white z-10 ${isCustom ? 'bg-green-600' : 'bg-blue-600'}`}>
                  {isCustom ? '🟢 Custom Link' : '🔵 VidSrc API'}
                </div>

                {/* Language Tag */}
                <div className="absolute top-2 right-2 bg-red-600/90 px-2 py-1 rounded text-xs text-white font-bold z-10">
                  {movie.language}
                </div>

                <div className="h-64 w-full bg-gray-900">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white mb-1 truncate" title={movie.title}>{movie.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{movie.year}</p>
                  
                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2">
                    <button 
                      onClick={() => openPreview(movie)} 
                      className="bg-yellow-600 text-white flex-1 py-2 rounded hover:bg-yellow-500 font-bold transition flex justify-center items-center text-sm"
                      title="Play video to check if it's working"
                    >
                      ▶️ Check
                    </button>
                    <button 
                      onClick={() => handleEditClick(movie)} 
                      className="bg-gray-600 text-white flex-1 py-2 rounded hover:bg-gray-500 font-bold transition flex justify-center items-center text-sm"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}