import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Hollywood from './pages/Hollywood';
import Bollywood from './pages/Bollywood';
import Tollywood from './pages/Tollywood';
import MovieDetail from './pages/MovieDetail';
import MoviePlayer from './components/MoviePlayer';
import Hero from './components/Hero';
import { useEffect } from 'react';
import TvChannels from './pages/TvChannels';
// Note: Ab humein Player.jsx ki zaroorat nahi kyunke MovieDetail mein hi player laga hua hai!

const App = () => {
useEffect(() => {
    // 1. Check karo ke user kahan se aaya hai
    const referrer = document.referrer;
    
    // 2. Aapka Gateway URL (Jahan se user ko aana chahiye)
    const gatewayURL = "https://redirect-onflix-movies.vercel.app/";

    // 3. Agar user direct aaya hai (Referrer khali hai) 
    // YA user kisi aur site se aaya hai (Gateway se nahi), toh usay wapis bhejo
    if (!referrer || !referrer.startsWith(gatewayURL)) {
      console.log("⚠️ Security Alert: Direct access blocked. Redirecting to Gateway...");
      window.location.href = gatewayURL;
    }
  }, []);
  return (
    <Router>
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/tv-channels" element={<TvChannels />} />
          <Route path="/hollywood" element={<Hollywood />} />
          <Route path="/bollywood" element={<Bollywood />} />
          <Route path="/tollywood" element={<Tollywood />} />
          <Route path="/watch/:id" element={<MovieDetail />} />
          <Route path="/play/:id" element={<MoviePlayer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
