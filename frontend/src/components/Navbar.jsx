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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* 1. Logo (Mobile par thora chota kiya hai taake search bar ko jagah mile) */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-1 md:gap-2 text-xl md:text-2xl font-bold text-red-600">
              <Film size={24} className="md:w-7 md:h-7" />
              <span className="hidden sm:block">OnFlix</span>
            </Link>
          </div>

          {/* 2. Desktop Menu (Hollywood, Bollywood) - Sirf bari screen par dikhega */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/hollywood" className="text-gray-300 hover:text-white transition font-medium">
              Hollywood (Hindi Dubbed)
            </Link>
            <Link to="/bollywood" className="text-gray-300 hover:text-white transition font-medium">
              Bollywood
            </Link>
          </div>

          {/* 3. Search Bar (Universal - Ab Mobile aur Desktop dono par top par rahega) */}
          <div className="flex-1 max-w-md mx-2 md:ml-8 relative">
            <input 
              type="text" 
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full py-1.5 md:py-2 pl-3 md:pl-4 pr-8 md:pr-10 text-white bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-xs md:text-sm"
            />
            <Search className="absolute right-2.5 top-2 md:top-2.5 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          </div>

          {/* 4. Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center flex-shrink-0">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none p-1"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* === MOBILE MENU (Sirf tab dikhega jab hamburger click hoga) === */}
      {/* 🔥 Search bar yahan se nikal kar oopar top bar mein permanently fix kar diya hai */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pt-2 pb-4 shadow-lg absolute w-full left-0">
          <div className="flex flex-col space-y-3 mt-2">
            <Link to="/hollywood" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white font-medium block py-2 border-b border-gray-800">
              Hollywood (Hindi Dubbed)
            </Link>
            <Link to="/bollywood" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white font-medium block py-2">
              Bollywood
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;