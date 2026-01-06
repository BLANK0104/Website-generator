import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, FolderOpen, Sparkles } from 'lucide-react';
import Generator from './components/Generator';
import Preview from './components/Preview';
import Projects from './components/Projects';
import { generateWebsite, createProject } from './services/api';
import './App.css';

function App() {
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // home, projects

  const handleGenerate = async (prompt) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Generating website from prompt:', prompt);
      const response = await generateWebsite(prompt);
      
      if (response.success) {
        setGeneratedCode(response.data);
        
        // Auto-save project
        try {
          const projectName = prompt.split(' ').slice(0, 5).join(' ');
          await createProject({
            name: projectName,
            description: response.data.description || prompt,
            prompt: prompt,
            generatedCode: {
              html: response.data.html,
              css: response.data.css,
              javascript: response.data.javascript
            },
            components: response.data.components || [],
            metadata: {
              isResponsive: true,
              theme: 'light'
            }
          });
          console.log('Project saved successfully');
        } catch (saveError) {
          console.error('Failed to save project:', saveError);
          // Don't show error to user - generation was successful
        }
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate website. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSelect = (project) => {
    setGeneratedCode({
      html: project.generatedCode.html,
      css: project.generatedCode.css,
      javascript: project.generatedCode.javascript,
      components: project.components,
      description: project.description
    });
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
            <div className="generator-layout">
              <div className="generator-section">
                <Generator onGenerate={handleGenerate} isLoading={isLoading} />
                
                {error && (
                  <div className="error-alert">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>

              <div className="preview-section">
                <Preview generatedCode={generatedCode} />
              </div>
            </div>
          ) : (
            <Projects onProjectSelect={handleProjectSelect} />
          )}
        </main>

        <footer className="app-footer">
          <p>
            &copy; 2026 AI Website Generator | Built with React & Node.js | Powered by OpenAI
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
