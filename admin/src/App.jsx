import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavbar from './components/Navbar';
import AddMovie from './pages/AddMovie';
import ManageMovies from './pages/ManageMovies';
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './pages/Login';
import AddChannel from './pages/AddChannel';
import ManageChannels from './pages/ManageChannels';
import EditChannel from './pages/EditChannel';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <ToastContainer theme="dark" />
        
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>             
              <Route path="/" element={<Navigate to="/admin/add-movie" />} />
              <Route path="/admin" element={<Navigate to="/admin/add-movie" />} />
              <Route path="/admin/add-channel" element={
                <>
                  <AdminNavbar />
                  <AddChannel />
                </>
              } />
              <Route path="/admin/manage-channels" element={
                <>
                  <AdminNavbar />
                  <ManageChannels />
                </>
              } />
              <Route path="/admin/channels/edit/:id" element={
                <>
                  <AdminNavbar />
                  <EditChannel />
                </>
              } />

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
                
              <Route path="/admin/manage-tollywood" element={
                <>
                  <AdminNavbar />
                  <ManageMovies categoryTitle="Tollywood" />
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
