import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, PlusCircle, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('onflix_admin_auth'); // Pass delete kar do
  navigate('/login'); // Wapis login par bhej do
};
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md border-b border-gray-800 sticky top-0 z-[100]">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Admin Logo / Title */}
        <div className="text-xl md:text-2xl font-black text-red-600 tracking-wider">
          <Link to="/admin" onClick={closeMenu}>OnFlix Admin</Link>
        </div>

        {/* === DESKTOP NAVIGATION === */}
        <div className="hidden md:flex gap-6 items-center font-semibold text-gray-300">
          <Link 
            to="/admin/add-movie" 
            className="hover:text-red-500 flex items-center gap-1 transition duration-300"
          >
            <PlusCircle size={18} /> Add Movie
          </Link>
          <Link 
            to="/admin/add-channel" 
            className="hover:text-red-500 flex items-center gap-1 transition duration-300"
          >
            <PlusCircle size={18} /> Add Channel
          </Link>
          <Link 
            to="/admin/manage-channels" 
            className="hover:text-red-500 flex items-center gap-1 transition duration-300"
          >
            <Film size={18} /> Manage Channels
          </Link>
          <Link 
            to="/admin/channels/edit/:id"
            className="hover:text-red-500 flex items-center gap-1 transition duration-300"
          >
            <Film size={18} /> Edit Channel
          </Link>
          <Link 

            to="/admin/manage-bollywood" 
            className="hover:text-red-500 flex items-center gap-1 transition duration-300"
          >
            <Film size={18} /> Bollywood
          </Link>
          
          <Link 
            to="/admin/manage-hollywood" 
            className="hover:text-red-500 flex items-center gap-1 transition duration-300"
          >
            <Film size={18} /> Hollywood
          </Link>
          <Link 
            to="/admin/manage-tollywood" 
            className="hover:text-red-500 flex items-center gap-1 transition duration-300"
          >
            <Film size={18} /> Tollywood
          </Link>
           <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md font-bold text-sm ml-4">
            Logout
            </button>
        </div>

        {/* === MOBILE MENU BUTTON === */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* === MOBILE DROPDOWN MENU === */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
          <Link 
            to="/admin/add-movie" 
            onClick={closeMenu}
            className="hover:text-red-500 font-bold flex items-center gap-3 py-2 border-b border-gray-700"
          >
            <PlusCircle size={20} className="text-red-600" /> Add New Movie
          </Link>
          <Link 
            to="/admin/add-channel" 
            onClick={closeMenu}
            className="hover:text-red-500 font-bold flex items-center gap-3 py-2 border-b border-gray-700"
          >
            <PlusCircle size={20} className="text-red-600" /> Add New Channel
          </Link>
            <Link
            to="/admin/manage-channels"
            onClick={closeMenu}
            className="hover:text-red-500 font-bold flex items-center gap-3 py-2 border-b border-gray-700"
          >
            <Film size={20} className="text-red-600" /> Manage Channels
          </Link>
          <Link
            to="/admin/channels/edit/:id"
            onClick={closeMenu}
            className="hover:text-red-500 font-bold flex items-center gap-3 py-2 border-b border-gray-700"
          >
            <Film size={20} className="text-red-600" /> Edit Channel
          </Link>
          <Link 
            to="/admin/manage-bollywood" 
            onClick={closeMenu}
            className="hover:text-red-500 font-bold flex items-center gap-3 py-2 border-b border-gray-700"
          >
            <Film size={20} className="text-red-600" /> Manage Bollywood
          </Link>
          
          <Link 
            to="/admin/manage-hollywood" 
            onClick={closeMenu}
            className="hover:text-red-500 font-bold flex items-center gap-3 py-2"
          >
            <Film size={20} className="text-red-600" /> Manage Hollywood
          </Link>
           <Link 
            to="/admin/manage-tollywood" 
            onClick={closeMenu}
            className="hover:text-red-500 font-bold flex items-center gap-3 py-2"
          >
            <Film size={20} className="text-red-600" /> Manage Tollywood
          </Link>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md font-bold text-sm ml-4">
            Logout
            </button>
        </div>
      </div>
    </nav>
  );
}