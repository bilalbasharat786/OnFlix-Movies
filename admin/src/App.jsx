import React from 'react';
// React Router ko import kiya hai pages change karne ke liye
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components aur Pages Import kiye hain
import AdminNavbar from './components/AdminNavbar'; // Tumhare components folder se
import AddMovie from './pages/AddMovie';
import ManageMovies from './pages/ManageMovies'; // Tumhare pages folder se

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        {/* Toast Notification Container (Alerts ke liye) */}
        <ToastContainer theme="dark" />
        
        {/* Navbar hamesha sabse upar show hoga */}
        <AdminNavbar />
        
        <div className="container mx-auto p-4">
          {/* Yahan se tumhare pages badlenge */}
          <Routes>
            {/* Jab koi seedha website kholey to usko Add Movie par bhej do */}
            <Route path="/" element={<Navigate to="/admin/add-movie" />} />
            <Route path="/admin" element={<Navigate to="/admin/add-movie" />} />
            
            {/* Asal Pages Ke Routes */}
            <Route path="/admin/add-movie" element={<AddMovie />} />
            
            {/* ManageMovies component ko alag alag props ke sath call kiya hai */}
            <Route path="/admin/manage-bollywood" element={<ManageMovies categoryTitle="Bollywood" />} />
            <Route path="/admin/manage-hollywood" element={<ManageMovies categoryTitle="Hollywood" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
