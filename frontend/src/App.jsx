import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';

const App = () => {
  return (
    <Router>
      <div className="bg-black min-h-screen text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Player />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
