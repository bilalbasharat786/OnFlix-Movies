import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddMovie from './pages/AddMovie';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Toast Notification Container (Alerts ke liye) */}
      <ToastContainer theme="dark" />
      
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-8">
          Netflix Admin Panel
        </h1>
        
        {/* Filhal seedha AddMovie page dikha rahe hain */}
        <AddMovie />
      </div>
    </div>
  );
};

export default App;
