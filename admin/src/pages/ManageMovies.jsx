import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ManageMovies({ categoryTitle }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // === CHECKER STATE ===
  const [vidStatus, setVidStatus] = useState({});

  // === SEARCH & PAGINATION STATES ===
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 50; // Ek page par 50 movies

  // Edit Modal aur Form ke liye states
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', posterUrl: '', imdbId: '', customUrl: '', description: '', year: '', language: '' 
  });

  const [previewLink, setPreviewLink] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // 1. Movies Fetch Karne Ka Function (Sirf ek dafa saara data layega)
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/movies/all`);

      // Category ke hisaab se filter (Bollywood / Hollywood)
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

  // Jab page khulay ya category change ho
  useEffect(() => {
    fetchMovies();
    setSearchTerm(''); // Category change hone par search khali kardo
    setCurrentPage(1); // Pehle page par wapis aao
  }, [categoryTitle]);

  // === LOGIC: SEARCHING & PAGINATION ===
  // 1. Pehle Search Filter lagao
  const searchedMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Phir Pagination lagao (Search hone ke baad)
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = searchedMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(searchedMovies.length / moviesPerPage);

  // === SMART AUTO-CHECKER FUNCTION (Sirf Current Page Ki Movies Ke Liye) ===
  const checkVidSrcStatus = async (moviesToCheck) => {
    const initialStatus = { ...vidStatus }; // Purana status bacha kar rakho
    
    // Nayi movies ko 'checking' status do
    moviesToCheck.forEach(m => {
      if (m.customUrl && m.customUrl !== "") {
        initialStatus[m._id] = 'custom';
      } else if (!initialStatus[m._id]) { // Agar pehle se check nahi hui
        initialStatus[m._id] = 'checking'; 
      }
    });
    setVidStatus(initialStatus);

    // Background check sirf unke liye jo custom nahi hain
    for (const movie of moviesToCheck) {
      if (!movie.customUrl || movie.customUrl === "") {
        try {
          const checkUrl = `https://vsembed.ru/embed/movie/${movie.imdbId}`;
          const { data } = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(checkUrl)}`);
          const htmlCode = data.contents || "";

          if (htmlCode.includes("unavailable at the moment") || htmlCode.includes("404 Not Found")) {
            setVidStatus(prev => ({ ...prev, [movie._id]: 'missing' }));
          } else {
            setVidStatus(prev => ({ ...prev, [movie._id]: 'working' }));
          }
        } catch (error) {
          setVidStatus(prev => ({ ...prev, [movie._id]: 'error' }));
        }
      }
    }
  };

  // Jab bhi naya page khulay ya search ho, sirf wo 50 movies check hongi
  useEffect(() => {
    if (currentMovies.length > 0) {
      checkVidSrcStatus(currentMovies);
    }
  }, [currentPage, searchTerm, movies]); // In teeno mein se kuch badle to dobara check karo

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

  // === 4. DELETE BUTTON LOGIC (NAYA FUNCTION) 🗑️ ===
  const handleDelete = async (id, title) => {
    // Alert popup taake ghalti se click hone par movie delete na ho
    const confirmDelete = window.confirm(`⚠️ WARNING: Kya aap waqai "${title}" ko hamesha ke liye delete karna chahte hain? Yeh wapis nahi aayegi!`);
    
    if (!confirmDelete) return; // Agar user Cancel dabaye to function yahin ruk jayega

    try {
      await axios.delete(`${API_BASE_URL}/api/movies/${id}`);
      toast.success(`🗑️ "${title}" successfully delete ho gayi!`);
      fetchMovies(); // Delete hone ke baad list ko dubara fetch karo taake wo movie screen se gayab ho jaye
    } catch (error) {
      console.error("❌ [DELETE ERROR]:", error);
      toast.error("Movie delete nahi ho saki. Console check karein!");
    }
  };

  // 5. Video Preview Checker Logic
  const openPreview = (movie) => {
    const linkToCheck = movie.customUrl && movie.customUrl !== "" 
      ? movie.customUrl 
      : `https://vsembed.ru/embed/movie/${movie.imdbId}`;
    setPreviewLink(linkToCheck);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      
      {/* HEADER AUR SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4 gap-4">
        <h2 className="text-3xl font-black text-white">
          Manage <span className="text-red-600">{categoryTitle}</span>
        </h2>
        
        <div className="w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Search movie by name..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Search karte hi Page 1 par aao
            }}
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-red-500 shadow-lg"
          />
        </div>
      </div>

      {/* === 🔴 LIVE PREVIEW MODAL === */}
      {previewLink && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-2xl relative">
            <div className="bg-gray-800 p-3 flex justify-between items-center">
              <span className="text-yellow-400 font-bold">🔍 Testing Player Link</span>
              <button onClick={() => setPreviewLink(null)} className="text-white bg-red-600 hover:bg-red-700 px-4 py-1 rounded font-bold">Close</button>
            </div>
            <iframe src={previewLink} className="w-full h-[60vh] md:h-[70vh]" frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
      )}

      {/* === EDIT MOVIE MODAL / FORM === */}
      {editingMovie && (
        <div className="bg-gray-800 p-8 rounded-xl mb-10 border border-red-900/50 shadow-2xl relative z-40">
          <button onClick={() => setEditingMovie(null)} className="absolute top-4 right-6 text-gray-400 hover:text-red-500 font-bold text-2xl">✕</button>
          <h3 className="text-2xl text-white font-bold mb-6">Edit: <span className="text-red-500">{formData.title}</span></h3>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-gray-400 mb-1">Movie Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full p-3 bg-gray-700 text-white rounded" /></div>
            <div><label className="block text-gray-400 mb-1">IMDB ID</label><input type="text" value={formData.imdbId} onChange={(e) => setFormData({...formData, imdbId: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded" /></div>
            <div className="md:col-span-2 p-4 bg-gray-900 border border-yellow-600/50 rounded"><label className="block text-yellow-500 mb-1 font-bold">Custom Player URL</label><input type="text" value={formData.customUrl} onChange={(e) => setFormData({...formData, customUrl: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded" /></div>
            <div className="flex gap-4 md:col-span-2">
              <div className="w-1/2"><label className="block text-gray-400 mb-1">Year</label><input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required className="w-full p-3 bg-gray-700 text-white rounded" /></div>
              <div className="w-1/2"><label className="block text-gray-400 mb-1">Language</label><select value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded"><option>Hindi</option><option>English</option><option>Dual Audio</option></select></div>
            </div>
            <div className="md:col-span-2"><label className="block text-gray-400 mb-1">Poster URL</label><input type="text" value={formData.posterUrl} onChange={(e) => setFormData({...formData, posterUrl: e.target.value})} required className="w-full p-3 bg-gray-700 text-white rounded" /></div>
            <div className="md:col-span-2"><label className="block text-gray-400 mb-1">Description</label><textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-700 text-white rounded"></textarea></div>
            <div className="md:col-span-2 mt-4"><button type="submit" className="w-full bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700">Save Changes</button></div>
          </form>
        </div>
      )}

      {/* === MOVIES LIST GRID === */}
      {loading ? (
        <div className="text-center text-red-500 text-xl font-bold py-10 animate-pulse">Movies load ho rahi hain...</div>
      ) : searchedMovies.length === 0 ? (
        <div className="text-center text-gray-400 text-xl font-semibold py-10 border border-gray-700 rounded-lg">Koi movie nahi mili.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {currentMovies.map((movie) => {
              const currentStatus = vidStatus[movie._id] || 'checking';
              let badgeClass = "bg-gray-600";
              let badgeText = "⏳ Checking...";
              let cardBorder = "border-gray-700";

              if (currentStatus === 'custom') { badgeClass = "bg-green-600"; badgeText = "🟢 Custom"; } 
              else if (currentStatus === 'working') { badgeClass = "bg-blue-600"; badgeText = "✅ OK"; } 
              else if (currentStatus === 'missing') { badgeClass = "bg-red-600 animate-pulse"; badgeText = "🔴 Missing"; cardBorder = "border-red-600 shadow-red-900/50 shadow-lg"; } 
              else if (currentStatus === 'error') { badgeClass = "bg-yellow-600"; badgeText = "⚠️ Error"; }

              return (
                <div key={movie._id} className={`bg-gray-800 rounded-lg overflow-hidden flex flex-col shadow-lg border-2 relative transition-all duration-300 ${cardBorder}`}>
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white z-10 ${badgeClass}`}>{badgeText}</div>
                  <div className="h-56 w-full bg-gray-900"><img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" /></div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-md font-bold text-white mb-1 truncate" title={movie.title}>{movie.title}</h3>
                    
                    {/* === ACTION BUTTONS (Update kiye gaye hain) === */}
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      <button onClick={() => openPreview(movie)} className="bg-yellow-600 text-white flex-1 min-w-[30%] py-1 rounded font-bold text-xs hover:bg-yellow-500 transition">▶️ Check</button>
                      <button onClick={() => handleEditClick(movie)} className="bg-gray-600 text-white flex-1 min-w-[30%] py-1 rounded font-bold text-xs hover:bg-gray-500 transition">✏️ Edit</button>
                      <button onClick={() => handleDelete(movie._id, movie.title)} className="bg-red-600 text-white flex-1 min-w-[30%] py-1 rounded font-bold text-xs hover:bg-red-700 transition">🗑️ Delete</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* === PAGINATION CONTROLS === */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-4 border-t border-gray-700">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded font-bold ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                Previous
              </button>
              
              <span className="text-white font-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded font-bold ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}