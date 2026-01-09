import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import Preview from './Preview';
import './Generator.css';

const Generator = () => {
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleWebsiteGenerated = (website) => {
    setGeneratedCode(website);
  };

  return (
    <div className="generator-container">
      <div className="generator-sidebar">
        <ChatInterface onWebsiteGenerated={handleWebsiteGenerated} />
      </div>
      <div className="generator-main">
        <Preview generatedCode={generatedCode} />
      </div>
    </div>
  );
};

export default Generator;
