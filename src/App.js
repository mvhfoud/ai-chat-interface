import React, { useState, useRef, useEffect } from 'react';
import icon from './icon.svg';
import './App.css';

const Logo = ({ isThinking }) => (
  <svg
    className="logo-svg"
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    viewBox="0 0 128 128"
  >
    <line x1="64" y1="64" x2="64" y2="24" stroke="white" strokeWidth="4" />
    <line x1="64" y1="64" x2="104" y2="64" stroke="white" strokeWidth="4" />
    <line x1="64" y1="64" x2="64" y2="104" stroke="white" strokeWidth="4" />
    <line x1="64" y1="64" x2="24" y2="64" stroke="white" strokeWidth="4" />

    <circle
      cx="64"
      cy="64"
      r="8"
      fill="white"
      className={isThinking ? "logo-center thinking" : "logo-center"}
    />

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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const textareaRef = useRef(null);
  const chatWindowRef = useRef(null);

  const userStartedChatting = messages.length > 0 || input.trim().length > 0;

  useEffect(() => {
    const handleScroll = () => {
      if (chatWindowRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatWindowRef.current;
        setShowScrollToBottom(scrollTop + clientHeight < scrollHeight - 100);
      }
    };

    const currentRef = chatWindowRef.current;
    currentRef?.addEventListener('scroll', handleScroll);
    return () => currentRef?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (chatWindowRef.current && !showScrollToBottom) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, showScrollToBottom]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsGenerating(true);

    const botResponse = {
      sender: 'bot',
      text: 'This is a simulated response.\nIt can span multiple lines.\nEnjoy!'
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <img src={icon} alt="Icon" className="header-icon" />
        <span className="header-text">
          ORCHESTR<strong>AI</strong>TOR
        </span>
      </div>

      <div className="chat-container">
        <div className="logo-container">
          <Logo isThinking={isGenerating} />
          {!userStartedChatting && (
            <p className="tagline">your friend who is good at everything ;)</p>
          )}
        </div>

        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="avatar">
                  <img src={icon} alt="Bot Avatar" />
                </div>
              )}
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
        </div>

        {showScrollToBottom && (
          <button 
            className="scroll-to-bottom"
            onClick={() => {
              chatWindowRef.current?.scrollTo({
                top: chatWindowRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }}
          >
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
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </button>
        )}

          <div className="chat-input">
            <textarea
              ref={textareaRef}
              rows="1"
              placeholder="ask anything"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button 
              className="attach-button"
              title="File attachments coming soon"
              disabled
            >
              {/* Paperclip icon remains here */}
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
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <button onClick={handleSend} className="send-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isGenerating ? (
                <rect x="6" y="6" width="12" height="12" fill="white" />
              ) : (
                <>
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </>
              )}
            </svg>
          </button>
          </div>
      </div>
    </div>
  );
}

export default App;