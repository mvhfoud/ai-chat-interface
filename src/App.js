import React, { useState, useRef } from 'react';
import icon from './icon.svg';
import './App.css';

/* Inline Logo component for animation control */
const Logo = ({ isThinking }) => (
  <svg
    className="logo-svg"
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    viewBox="0 0 128 128"
  >
    {/* Connecting lines */}
    <line x1="64" y1="64" x2="64" y2="24" stroke="white" strokeWidth="4" />
    <line x1="64" y1="64" x2="104" y2="64" stroke="white" strokeWidth="4" />
    <line x1="64" y1="64" x2="64" y2="104" stroke="white" strokeWidth="4" />
    <line x1="64" y1="64" x2="24" y2="64" stroke="white" strokeWidth="4" />

    {/* Center circle */}
    <circle
      cx="64"
      cy="64"
      r="8"
      fill="white"
      className={isThinking ? "logo-center thinking" : "logo-center"}
    />

    {/* Outer circles */}
    <circle
      cx="64"
      cy="24"
      r="8"
      fill="white"
      className={isThinking ? "logo-node thinking top" : "logo-node top"}
    />
    <circle
      cx="104"
      cy="64"
      r="8"
      fill="white"
      className={isThinking ? "logo-node thinking right" : "logo-node right"}
    />
    <circle
      cx="64"
      cy="104"
      r="8"
      fill="white"
      className={isThinking ? "logo-node thinking bottom" : "logo-node bottom"}
    />
    <circle
      cx="24"
      cy="64"
      r="8"
      fill="white"
      className={isThinking ? "logo-node thinking left" : "logo-node left"}
    />
  </svg>
);

function App() {
  const [dailyLimit, setDailyLimit] = useState(5);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef(null);

  const userStartedChatting = messages.length > 0 || input.trim().length > 0;

  const handleSend = () => {
    if (input.trim() === '') return;

    // Append user's message
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) {
      // Reset the textarea height back to its minimal size
      textareaRef.current.style.height = 'auto';
    }
    setIsGenerating(true);

    // Simulate a bot response after 2 seconds
    const botResponse = { sender: 'bot', text: 'This is a simulated response.' };
    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Auto-resize the textarea dynamically
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleKeyDown = (e) => {
    // If Enter is pressed without Shift, send the message.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter allows a newline (default behavior).
  };

  return (
    <div className="app">
      {/* Top slider area */}
      <div className="daily-limit">
        <label htmlFor="limit-slider">Daily Consumption Limit: ${dailyLimit}</label>
        <input
          id="limit-slider"
          type="range"
          min="1"
          max="10"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(e.target.value)}
        />
      </div>

      {/* Main chat container */}
      <div className="chat-container">
        {/* Background logo (always in the back) */}
        <div className="logo-container">
          <Logo isThinking={isGenerating} />
      
        </div>

        {/* Scrollable chat messages area */}
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Fixed input area at the bottom */}
        <div className="chat-input">
          <textarea
            ref={textareaRef}
            rows="1"
            placeholder="ask anything"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend} className="send-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
