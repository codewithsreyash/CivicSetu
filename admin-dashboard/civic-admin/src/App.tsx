import React from 'react';
import './App.css';
import ReportsPage from './pages/ReportsPage';
import StatsPage from './pages/StatsPage';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Reports</NavLink>
          <NavLink to="/stats" className={({isActive}) => isActive ? 'active' : ''}>Stats</NavLink>
        </nav>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<ReportsPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
