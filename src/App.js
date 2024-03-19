import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { GridProvider } from './pages/GridContext'; 
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import CreditsPage from './pages/CreditsPage';
import './App.css';

const App = () => {
  return (
    <GridProvider> {}
      <Router>
        <div className="app-container">
          <nav className="navbar">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/game" className="nav-link">Game</Link>
            <Link to="/credits" className="nav-link">Credits</Link>
          </nav>
          <Routes>
            <Route path="/game" element={<GamePage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </GridProvider>
  );
}

export default App;
