import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminNavbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Admin Logo / Title */}
        <div className="text-2xl font-black text-red-600 tracking-wider">
          <Link to="/admin">OnFlix Admin</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center font-semibold text-gray-300">
          <Link 
            to="/admin/add-movie" 
            className="hover:text-red-500 transition duration-300"
          >
            + Add Movie
          </Link>
          
          <Link 
            to="/admin/manage-bollywood" 
            className="hover:text-red-500 transition duration-300"
          >
            Bollywood
          </Link>
          
          <Link 
            to="/admin/manage-hollywood" 
            className="hover:text-red-500 transition duration-300"
          >
            Hollywood (Dubbed)
          </Link>
        </div>
        
      </div>
    </nav>
  );
}