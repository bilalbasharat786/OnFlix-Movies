import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';
import Navbar from './components/Navbar';
import Hollywood from './pages/Hollywood';
import Bollywood from './pages/Bollywood';

const App = () => {
  return (
    <Router>
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hollywood" element={<Hollywood />} />
          <Route path="/bollywood" element={<Bollywood />} />
          <Route path="/watch/:id" element={<Player />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
