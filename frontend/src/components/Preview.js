import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Code, Download, Copy, Check, Maximize2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { generatePreviewURL, exportWebsite, copyToClipboard } from '../utils/export';
import './Preview.css';

const Preview = ({ generatedCode }) => {
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [activeTab, setActiveTab] = useState('preview'); // preview, html, css, js
  const [previewURL, setPreviewURL] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (generatedCode) {
      const url = generatePreviewURL(
        generatedCode.html,
        generatedCode.css,
        generatedCode.javascript
      );
      setPreviewURL(url);

      return () => {
        if (previewURL) {
          URL.revokeObjectURL(previewURL);
        }
      };
    }
  }, [generatedCode]);

  const handleCopy = async (code) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    exportWebsite(
      generatedCode.html,
      generatedCode.css,
      generatedCode.javascript,
      'my-website'
    );
  };

  const handleFullscreen = () => {
    // Open preview in a new window/tab without any UI interference
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview - Fullscreen</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              overflow: auto;
            }
          </style>
        </head>
        <body>
          <iframe 
            src="${previewURL}" 
            style="width: 100vw; height: 100vh; border: none; display: block;"
            sandbox="allow-scripts"
          ></iframe>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  if (!generatedCode) {
    return (
      <div className="preview preview-empty">
        <div className="empty-state">
          <Code size={64} color="#ccc" />
          <h2>No Preview Available</h2>
          <p>Generate a website to see the preview here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview">
      <div className="preview-header">
        <div className="preview-tabs">
          <button
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            className={`tab ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
          >
            HTML
          </button>
          <button
            className={`tab ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
          >
            CSS
          </button>
          {generatedCode.javascript && (
            <button
              className={`tab ${activeTab === 'js' ? 'active' : ''}`}
              onClick={() => setActiveTab('js')}
            >
              JavaScript
            </button>
          )}
        </div>

        <div className="preview-actions">
          {activeTab === 'preview' ? (
            <>
              <button
                className={`view-btn ${viewMode === 'desktop' ? 'active' : ''}`}
                onClick={() => setViewMode('desktop')}
                title="Desktop view"
              >
                <Monitor size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === 'tablet' ? 'active' : ''}`}
                onClick={() => setViewMode('tablet')}
                title="Tablet view"
              >
                <Tablet size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                onClick={() => setViewMode('mobile')}
                title="Mobile view"
              >
                <Smartphone size={18} />
              </button>
              <button
                className="view-btn fullscreen-btn"
                onClick={handleFullscreen}
                title="Open in fullscreen (new tab)"
              >
                <Maximize2 size={18} />
              </button>
            </>
          ) : (
            <button
              className="action-btn"
              onClick={() => {
                const code = activeTab === 'html' ? generatedCode.html :
                           activeTab === 'css' ? generatedCode.css :
                           generatedCode.javascript;
                handleCopy(code);
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
          
          <button className="action-btn primary" onClick={handleExport}>
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="preview-content">
        {activeTab === 'preview' ? (
          <div className="preview-frame-wrapper">
            <div className="preview-frame" style={{ width: getPreviewWidth() }}>
              <iframe
                src={previewURL}
                title="Website Preview"
                className="preview-iframe"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        ) : (
          <div className="code-viewer">
            <SyntaxHighlighter
              language={activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript'}
              style={tomorrow}
              showLineNumbers
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '14px',
                height: '100%'
              }}
            >
              {activeTab === 'html' ? generatedCode.html :
               activeTab === 'css' ? generatedCode.css :
               generatedCode.javascript || '// No JavaScript code'}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {generatedCode.description && activeTab === 'preview' && (
        <div className="preview-info">
          <h3>About this website:</h3>
          <p>{generatedCode.description}</p>
          {generatedCode.components && generatedCode.components.length > 0 && (
            <div className="components-used">
              <strong>Pages included:</strong>{' '}
              {generatedCode.components.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Preview;
