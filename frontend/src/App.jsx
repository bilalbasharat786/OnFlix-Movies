import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Hollywood from './pages/Hollywood';
import Bollywood from './pages/Bollywood';
import MovieDetail from './pages/MovieDetail';
import MoviePlayer from './components/MoviePlayer';
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
          <Route path="/watch/:id" element={<MovieDetail />} />
          <Route path="/play/:id" element={<MoviePlayer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
