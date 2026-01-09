import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = ({ onWebsiteGenerated }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://website-generator-tau.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationId: conversationId
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      
      // Update conversation ID
      setConversationId(data.conversationId);
      
      // Add assistant response
      const assistantMessage = data.messages[data.messages.length - 1];
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update generated website
      onWebsiteGenerated(data.website);
      
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, something went wrong. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>💬 Website Generator Chat</h2>
        <p>Describe your website or request changes</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>👋 Welcome!</h3>
            <p>Tell me what kind of website you want to create:</p>
            <div className="suggestions">
              <button onClick={() => setInput('Create a restaurant website with menu and reservations')}>
                🍽️ Restaurant
              </button>
              <button onClick={() => setInput('Create a jewelry store website with product gallery')}>
                💎 Jewelry Store
              </button>
              <button onClick={() => setInput('Create a photography portfolio website')}>
                📷 Photography
              </button>
              <button onClick={() => setInput('Create a gym website with class schedules')}>
                💪 Fitness Gym
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content loading">
              <Loader className="spinner" size={16} />
              Generating your website...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={conversationId ? "Request changes (e.g., 'Make it blue', 'Add more services', 'Change the name')" : "Describe the website you want to create..."}
          rows={2}
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={!input.trim() || isLoading}
          className="send-btn"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
