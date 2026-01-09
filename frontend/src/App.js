import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Home, FolderOpen, Sparkles } from 'lucide-react';
import Generator from './components/Generator';
import Projects from './components/Projects';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleProjectSelect = (project) => {
    // Projects functionality can be implemented later
    console.log('Selected project:', project);
    setCurrentView('home');
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <Sparkles size={24} />
              <span>AI Website Generator</span>
            </div>
            <div className="nav-links">
              <button
                className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentView('home')}
              >
                <Home size={18} />
                Generate
              </button>
              <button
                className={`nav-link ${currentView === 'projects' ? 'active' : ''}`}
                onClick={() => setCurrentView('projects')}
              >
                <FolderOpen size={18} />
                Projects
              </button>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {currentView === 'home' ? (
            <Generator />
          ) : (
            <Projects onProjectSelect={handleProjectSelect} />
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
