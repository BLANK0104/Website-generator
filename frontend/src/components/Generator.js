import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import './Generator.css';

const Generator = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [examples] = useState([
    'Create a portfolio website for a photographer with a gallery and contact form',
    'Build an e-commerce site for handmade jewelry with product showcase',
    'Design a landing page for a mobile app with features section and download buttons',
    'Create a restaurant website with menu, reservations, and location map',
    'Build a blog website with article cards and sidebar navigation'
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <div className="generator">
      <div className="generator-header">
        <h1 className="generator-title">AI Website Generator</h1>
        <p className="generator-subtitle">
          Describe your dream website in natural language and watch AI bring it to life
        </p>
      </div>

      <form className="generator-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <textarea
            className="generator-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a modern portfolio website for a software developer with a projects section, about me page, and contact form..."
            rows={4}
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className="generate-btn"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <Loader className="btn-icon spinning" size={20} />
              Generating...
            </>
          ) : (
            <>
              <Send className="btn-icon" size={20} />
              Generate Website
            </>
          )}
        </button>
      </form>

      <div className="examples-section">
        <h3 className="examples-title">Try these examples:</h3>
        <div className="examples-grid">
          {examples.map((example, index) => (
            <button
              key={index}
              className="example-card"
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Generator;
