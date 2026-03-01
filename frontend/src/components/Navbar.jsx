import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Menu, X, Film } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // URL se search word nikalne ke liye
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation(); // Yeh pata lagane ke liye ke user kis page par hai
  
  const searchQuery = searchParams.get('q') || '';

  // === 🔥 MAGIC: Super Fast Global Search Logic ===
  const handleSearch = (e) => {
    const query = e.target.value;
    
    if (query) {
      // User chahay kisi bhi page par ho, type karte hi usay Home (/) par bhej do 
      // taake poore database mein Global Search lag sakay!
      navigate(`/?q=${query}`); 
    } else {
      // Agar user backspace karke search bilkul khali kar de
      if (location.pathname === '/') {
        navigate('/'); // Agar Home par hai to wahi fresh page load kar do
      } else {
        navigate(location.pathname); // Agar kisi aur page par hai to wahi rehne do
      }
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-red-600">
              <Film size={28} />
              OnFlix
            </Link>
          </div>

          {/* 2. Desktop Menu (Hollywood, Bollywood) */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/hollywood" className="text-gray-300 hover:text-white transition font-medium">
              Hollywood (Hindi Dubbed)
            </Link>
            <Link to="/bollywood" className="text-gray-300 hover:text-white transition font-medium">
              Bollywood
            </Link>
          </div>

          {/* 3. Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md ml-8 relative">
            <input 
              type="text" 
              placeholder="Search movies globally..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full py-2 pl-4 pr-10 text-white bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* 4. Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* === MOBILE MENU (Sirf tab dikhega jab hamburger click hoga) === */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pt-2 pb-4 space-y-4 shadow-lg">
          
          {/* Mobile Search Bar */}
          <div className="relative mt-2">
            <input 
              type="text" 
              placeholder="Search movies globally..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full py-2 pl-4 pr-10 text-white bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
          {/* Mobile Links */}
          <div className="flex flex-col space-y-3">
            <Link to="/hollywood" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white font-medium block">
              Hollywood (Hindi Dubbed)
            </Link>
            <Link to="/bollywood" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white font-medium block">
              Bollywood
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;