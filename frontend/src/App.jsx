import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Hollywood from './pages/Hollywood';
import Bollywood from './pages/Bollywood';
import MovieDetail from './pages/MovieDetail';
// Note: Ab humein Player.jsx ki zaroorat nahi kyunke MovieDetail mein hi player laga hua hai!

const App = () => {
  return (
    <Router>
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hollywood" element={<Hollywood />} />
          <Route path="/bollywood" element={<Bollywood />} />
          
          {/* 🔥 JADU YAHAN HAI: 
              Ab poster par click karne se (jo /watch/ pe bhejta hai), 
              direct movie nahi chalegi balki tumhara VIP MovieDetail page khulega! 
          */}
          <Route path="/watch/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
