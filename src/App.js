// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [dailyLimit, setDailyLimit] = useState(5); // default daily limit set to $5
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    // Append the user's message
    const userMessage = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    // Simulate a bot response (replace this with your API call later)
    const botResponse = { sender: 'bot', text: 'This is a simulated response.' };
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="app">
      {/* Daily Consumption Slider */}
      <div className="daily-limit">
        <label htmlFor="limit-slider">
          Daily Consumption Limit: ${dailyLimit}
        </label>
        <input
          id="limit-slider"
          type="range"
          min="1"
          max="10"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(e.target.value)}
        />
      </div>

      {/* Chat Interface */}
      <div className="chat-container">
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
