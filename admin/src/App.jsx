import React from 'react';
// React Router ko import kiya hai pages change karne ke liye
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components aur Pages Import kiye hain
import AdminNavbar from './components/Navbar'; // Tumhare components folder se
import AddMovie from './pages/AddMovie';
import ManageMovies from './pages/ManageMovies'; // Tumhare pages folder se
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        {/* Toast Notification Container (Alerts ke liye) */}
        <ToastContainer theme="dark" />
        
        <div className="container mx-auto p-4">
          <Routes>
            {/* 1. KHULA RASTA (Sirf Login Page) */}
            <Route path="/login" element={<Login />} />

            {/* 2. GUARD WALA RASTA (Protected Routes) */}
            <Route element={<ProtectedRoute />}>
              {/* 🔥 Ab yeh saare pages Guard ke andar hain! Bina login nahi khulenge */}
              
              <Route path="/" element={<Navigate to="/admin/add-movie" />} />
              <Route path="/admin" element={<Navigate to="/admin/add-movie" />} />
              
              {/* Asal Pages Ke Routes (In sab ke sath Navbar laga diya hai taake login ke baad hi dikhe) */}
              <Route path="/admin/add-movie" element={
                <>
                  <AdminNavbar />
                  <AddMovie />
                </>
              } />
              
              <Route path="/admin/manage-bollywood" element={
                <>
                  <AdminNavbar />
                  <ManageMovies categoryTitle="Bollywood" />
                </>
              } />
              
              <Route path="/admin/manage-hollywood" element={
                <>
                  <AdminNavbar />
                  <ManageMovies categoryTitle="Hollywood" />
                </>
              } />
              
            </Route>

            {/* Agar koi ajeeb URL likhe toh wapis login par bhej do */}
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
