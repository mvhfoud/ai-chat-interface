import React, { useState, useRef, useEffect } from 'react';
import icon from './icon.svg';
import deepseekLogo from './deepseek.svg';
import claudeLogo from './claude.svg';
import openaiLogo from './openai.svg';
import './App.css';

const LogoIcon = ({ type, active, size }) => {
  let src;
  let activeColor;
  switch (type) {
    case 'deepseek':
      src = deepseekLogo;
      activeColor = '#007BFF'; // blue
      break;
    case 'claude':
      src = claudeLogo;
      activeColor = '#FF0000'; // red
      break;
    case 'openai': // representing GPT
      src = openaiLogo;
      activeColor = '#FFFFFF'; // white
      break;
    default:
      src = '';
      activeColor = '#808080';
  }
  return (
    <img
      src={src}
      alt={`${type} logo`}
      className={`logo-icon ${active ? 'active' : ''}`}
      style={{
        ...(active ? { '--active-color': activeColor } : {}),
        width: size,
        height: size,
        background: 'none'
      }}
    />
  );
};

const Sidebar = ({ isOpen, toggleSidebar, handleNewChat }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle-button" onClick={toggleSidebar}>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
        )}
      </button>
      <div className="sidebar-content">
        <button className="send-button new-chat-button" onClick={handleNewChat}>
          <strong>New chat</strong>
        </button>
      </div>
    </div>
  );
};

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
      className={isThinking ? 'logo-center thinking' : 'logo-center'}
    />
    <circle
      cx="64"
      cy="24"
      r="8"
      fill="white"
      className={isThinking ? 'logo-node thinking top' : 'logo-node top'}
    />
    <circle
      cx="104"
      cy="64"
      r="8"
      fill="white"
      className={isThinking ? 'logo-node thinking right' : 'logo-node right'}
    />
    <circle
      cx="64"
      cy="104"
      r="8"
      fill="white"
      className={isThinking ? 'logo-node thinking bottom' : 'logo-node bottom'}
    />
    <circle
      cx="24"
      cy="64"
      r="8"
      fill="white"
      className={isThinking ? 'logo-node thinking left' : 'logo-node left'}
    />
  </svg>
);

const ChatInputWithFooter = ({ chatInputBlock }) => {
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      {chatInputBlock}
      <div
        style={{
          marginTop: '10px',
          textAlign: 'center',
          fontSize: '10px',
          color: '#ccd6f6'
        }}
      >
        orchestrAItor can make mistakes. Check important info.
      </div>
    </div>
  );
};

// CodeBlock component: Renders a header with a copy icon and label.
// When clicked, it changes to "Copied" with a checkmark icon for 2 seconds.
const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-container">
      <div className="code-header">
        <span>code</span>
        <button className="copy-code-button" onClick={handleCopy}>
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="copy-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="copy-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="code-content">
        <pre className="code-block">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

// Splits text by triple backticks and renders code parts using CodeBlock.
function renderMessageText(text) {
  const parts = text.split(/```/);
  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return <span key={index}>{part}</span>;
    }
    return <CodeBlock key={index} code={part} />;
  });
}

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textareaRef = useRef(null);
  const chatWindowRef = useRef(null);

  const isInitial = messages.length === 0;

  useEffect(() => {
    if (!isInitial) {
      const handleScroll = () => {
        if (chatWindowRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = chatWindowRef.current;
          // Only show the scroll button if the gap is more than 50px.
          setShowScrollToBottom(scrollHeight - scrollTop - clientHeight > 50);
        }
      };

      const currentRef = chatWindowRef.current;
      currentRef?.addEventListener('scroll', handleScroll);
      return () => currentRef?.removeEventListener('scroll', handleScroll);
    }
  }, [isInitial]);

  useEffect(() => {
    if (!isInitial && chatWindowRef.current && !showScrollToBottom) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, showScrollToBottom, isInitial]);

  const handleSend = () => {
    if (input.trim() === '') return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsGenerating(true);

    // Simulated bot response including a code block for "Hello world!"
    const botResponse = {
      sender: 'bot',
      text:
        'This is a simulated response.\nIt can span multiple lines.\n```Hello world!```',
      activeLogo: Math.floor(Math.random() * 3)
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const chatInputBlock = (
    <div className="chat-input">
      <textarea
        ref={textareaRef}
        rows="1"
        placeholder="ask anything"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ fontFamily: 'inherit' }}
      />
      <button className="attach-button" title="File attachments coming soon" disabled>
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
            <rect x="6" y="6" width="12" height="12"  />
          ) : (
            <>
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </>
          )}
        </svg>
      </button>
    </div>
  );

  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleNewChat={handleNewChat} />
      <div className="main-content">
        {isInitial ? (
          <div
            className="initial-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '140vh',
              textAlign: 'center',
              color: '#ccd6f6'
            }}
          >
            <div
              className="initial-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                transform: 'scale(1.15)',
                transformOrigin: 'center'
              }}
            >
              <img src={icon} alt="Icon" className="header-icon" style={{ marginBottom: 0 }} />
              <div className="header-text">
                ORCHESTR<strong>AI</strong>TOR
              </div>
            </div>
            <ChatInputWithFooter chatInputBlock={chatInputBlock} />
            <div
              style={{
                marginTop: '140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <p className="glow" style={{ fontSize: '15px', margin: 0 }}>
                manifest the power of all three <strong>at once!</strong>
              </p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <LogoIcon type="deepseek" active={false} size="45px" />
                <LogoIcon type="claude" active={false} size="45px" />
                <LogoIcon type="openai" active={false} size="45px" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="header">
              <img src={icon} alt="Icon" className="header-icon" />
              <span className="header-text">
                ORCHESTR<strong>AI</strong>TOR
              </span>
            </div>
            <div className="chat-container">
              <div className="logo-container">
                <Logo isThinking={isGenerating} />
              </div>
              <div className="chat-area">
                <div className="chat-window" ref={chatWindowRef}>
                  {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                      {msg.sender === 'bot' && (
                        <div className="avatar">
                          <img src={icon} alt="Bot Avatar" />
                        </div>
                      )}
                      <div>
                        <div className="message-text">{renderMessageText(msg.text)}</div>
                        {msg.sender === 'bot' && (
                          <div className="message-actions">
                            <div className="logo-buttons">
                              <LogoIcon type="deepseek" active={msg.activeLogo === 0} />
                              <LogoIcon type="claude" active={msg.activeLogo === 1} />
                              <LogoIcon type="openai" active={msg.activeLogo === 2} />
                            </div>
                            <button
                              className="action-button copy-button"
                              onClick={() => navigator.clipboard.writeText(msg.text)}
                              title="Copy text"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
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
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
              <ChatInputWithFooter chatInputBlock={chatInputBlock} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
