import React, { useState } from 'react';
import './WebsiteGenerator.css';
import api from '../services/api';

function WebsiteGenerator() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('preview');

  const examplePrompts = [
    "Create a portfolio website for a photographer with a gallery and contact form",
    "Build a business website with services, about page, and contact form",
    "Make a restaurant website with menu, location, and online reservation",
    "Create a gym website with classes, trainers, and membership signup",
    "Build a jewelry store website with product gallery and contact form"
  ];

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError('Please describe the website you want to create');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/website/generate', { userInput });
      setResult(response.data);
      setActiveTab('preview');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate website');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result?.websiteId) return;

    try {
      const response = await api.post(`/website/${result.websiteId}/save`);
      alert(`Website saved to: ${response.data.projectPath}`);
    } catch (err) {
      alert('Failed to save website: ' + err.message);
    }
  };

  const handleExampleClick = (example) => {
    setUserInput(example);
  };

  const renderPreview = () => {
    if (!result) return null;

    const previewUrl = `http://localhost:5000/preview/${result.websiteId}`;

    return (
      <div className="preview-container">
        <div className="preview-header">
          <h3>Website Preview</h3>
          <div className="preview-actions">
            <button onClick={() => window.open(previewUrl, '_blank')} className="btn-secondary">
              Open in New Tab
            </button>
            <button onClick={handleSave} className="btn-primary">
              Save to Filesystem
            </button>
          </div>
        </div>
        <iframe
          src={previewUrl}
          title="Website Preview"
          className="preview-iframe"
        />
      </div>
    );
  };

  const renderSummary = () => {
    if (!result?.summary) return null;

    return (
      <div className="summary-container">
        <h3>Website Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <label>Website Name:</label>
            <span>{result.summary.siteName}</span>
          </div>
          <div className="summary-item">
            <label>Type:</label>
            <span>{result.summary.websiteType}</span>
          </div>
          <div className="summary-item">
            <label>Pages:</label>
            <span>{result.summary.pageCount}</span>
          </div>
          <div className="summary-item full-width">
            <label>Page List:</label>
            <div className="tag-list">
              {result.summary.pages.map((page, i) => (
                <span key={i} className="tag">{page}</span>
              ))}
            </div>
          </div>
          <div className="summary-item full-width">
            <label>Components:</label>
            <div className="tag-list">
              {result.summary.components.map((comp, i) => (
                <span key={i} className="tag">{comp}</span>
              ))}
            </div>
          </div>
          <div className="summary-item full-width">
            <label>Features:</label>
            <div className="tag-list">
              {result.summary.features.map((feat, i) => (
                <span key={i} className="tag tag-feature">{feat}</span>
              ))}
            </div>
          </div>
          <div className="summary-item">
            <label>Backend:</label>
            <span className={result.summary.hasBackend ? 'text-success' : 'text-muted'}>
              {result.summary.hasBackend ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div className="summary-item">
            <label>Forms:</label>
            <span className={result.summary.hasForms ? 'text-success' : 'text-muted'}>
              {result.summary.hasForms ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div className="summary-item">
            <label>Authentication:</label>
            <span className={result.summary.hasAuth ? 'text-success' : 'text-muted'}>
              {result.summary.hasAuth ? '✓ Yes' : '✗ No'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderFiles = () => {
    if (!result?.files) return null;

    const groupedFiles = result.files.reduce((acc, file) => {
      const folder = file.path.split('/')[0];
      if (!acc[folder]) acc[folder] = [];
      acc[folder].push(file);
      return acc;
    }, {});

    return (
      <div className="files-container">
        <h3>Generated Files ({result.files.length})</h3>
        <div className="file-tree">
          {Object.keys(groupedFiles).map(folder => (
            <div key={folder} className="folder-group">
              <div className="folder-name">📁 {folder}/</div>
              <div className="folder-files">
                {groupedFiles[folder].map((file, i) => (
                  <div key={i} className="file-item">
                    <span className="file-icon">📄</span>
                    <span className="file-path">{file.path}</span>
                    <span className="file-size">
                      {(file.content.length / 1024).toFixed(2)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="website-generator">
      <div className="generator-header">
        <h1>🚀 AI Website Generator</h1>
        <p>Describe your website in natural language and watch AI build it for you</p>
      </div>

      <div className="generator-input-section">
        <div className="input-container">
          <label htmlFor="userInput">What website do you want to create?</label>
          <textarea
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Example: Create a portfolio website for a photographer with a gallery, about page, and contact form..."
            rows={6}
            disabled={loading}
          />
          <button 
            onClick={handleGenerate} 
            disabled={loading || !userInput.trim()}
            className="btn-generate"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating Website...
              </>
            ) : (
              <>Generate Website</>
            )}
          </button>
        </div>

        <div className="examples-section">
          <h3>Try these examples:</h3>
          <div className="examples-list">
            {examplePrompts.map((prompt, i) => (
              <div 
                key={i} 
                className="example-card"
                onClick={() => handleExampleClick(prompt)}
              >
                <span className="example-icon">💡</span>
                <p>{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {result && (
        <div className="result-section">
          <div className="tabs">
            <button 
              className={activeTab === 'preview' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button 
              className={activeTab === 'summary' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button 
              className={activeTab === 'files' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('files')}
            >
              Files
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'preview' && renderPreview()}
            {activeTab === 'summary' && renderSummary()}
            {activeTab === 'files' && renderFiles()}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2>Generating Your Website...</h2>
            <p>This may take 20-30 seconds</p>
            <div className="loading-steps">
              <div className="step">✓ Analyzing requirements</div>
              <div className="step">✓ Designing components</div>
              <div className="step">⏳ Generating code</div>
              <div className="step">⏳ Building pages</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebsiteGenerator;
