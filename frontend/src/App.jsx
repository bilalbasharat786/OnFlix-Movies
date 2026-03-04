import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Hollywood from './pages/Hollywood';
import Bollywood from './pages/Bollywood';
import MovieDetail from './pages/MovieDetail';
import MoviePlayer from './components/MoviePlayer';
import Hero from './components/Hero';
// Note: Ab humein Player.jsx ki zaroorat nahi kyunke MovieDetail mein hi player laga hua hai!

const App = () => {
  useEffect(() => {
    // 1. Check karo ke kya user isi session mein verify hua hai?
    const isVerified = sessionStorage.getItem("onflix_verified");
    
    // 2. Admin Protection: Check karo ke kya user Admin URL par hai?
    // Agar URL mein "/admin" aata hai, toh check mat karo
    const isAdminPath = window.location.pathname.startsWith('/admin');

    const gatewayURL = "https://redirect-onflix-movies.vercel.app/";

    // 3. Agar Admin nahi hai AUR verify bhi nahi hua, toh gateway par bhejo
    if (!isAdminPath && isVerified !== "true") {
      console.log("⚠️ Verification Required. Redirecting...");
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
