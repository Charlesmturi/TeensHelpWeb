import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat.css';

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCounselors, setOnlineCounselors] = useState(3);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [userRole, setUserRole] = useState('teen');
  const [showCounselorList, setShowCounselorList] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Simulated database of counselors
  const counselors = [
    { id: 1, name: 'Sarah Johnson', specialty: 'Mental Health', online: true, rating: 4.9 },
    { id: 2, name: 'Michael Chen', specialty: 'Addiction Recovery', online: true, rating: 4.8 },
    { id: 3, name: 'Jessica Williams', specialty: 'Peer Pressure', online: true, rating: 4.7 },
    { id: 4, name: 'David Smith', specialty: 'Relationships', online: false, rating: 4.9 },
  ];

  // Dangerous keywords that trigger alerts
  const dangerKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'harm myself'];

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for dangerous messages
  useEffect(() => {
    const checkForDanger = () => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === 'user') {
        const containsDanger = dangerKeywords.some(keyword => 
          lastMessage.text.toLowerCase().includes(keyword)
        );
        
        if (containsDanger) {
          alert('URGENT: Your message contains concerning content. If you are in crisis, please call the National Suicide Prevention Lifeline at 1-800-273-8255 immediately.');
          console.log('DANGER ALERT: Potential crisis detected');
        }
      }
    };

    checkForDanger();
  }, [messages]);

  // Simulate receiving messages
  useEffect(() => {
    if (isConnected) {
      const messageCheckInterval = setInterval(() => {
        if (messages.length > 0 && 
            messages[messages.length - 1].sender === 'user' &&
            !typing) {
          simulateTypingIndicator();
        }
      }, 1000);

      return () => clearInterval(messageCheckInterval);
    }
  }, [isConnected, messages, typing]);

  const simulateTypingIndicator = () => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      simulateCounselorResponse();
    }, 2000);
  };

  const simulateCounselorResponse = () => {
    const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
    let responseText = "";

    if (lastUserMessage) {
      if (lastUserMessage.text.toLowerCase().includes('anxious') || 
          lastUserMessage.text.toLowerCase().includes('anxiety')) {
        responseText = "I understand anxiety can be really challenging. Have you tried any breathing exercises to help manage it?";
      } else if (lastUserMessage.text.toLowerCase().includes('sad') || 
                lastUserMessage.text.toLowerCase().includes('depress')) {
        responseText = "I'm sorry you're feeling this way. It's important to remember that these feelings can pass. Would you like to talk more about what's causing these feelings?";
      } else if (lastUserMessage.text.toLowerCase().includes('stress') || 
                lastUserMessage.text.toLowerCase().includes('pressure')) {
        responseText = "Stress is a common experience, especially for teens. What are some of the main stressors you're dealing with right now?";
      } else if (lastUserMessage.text.toLowerCase().includes('alone') || 
                lastUserMessage.text.toLowerCase().includes('lonely')) {
        responseText = "Feeling alone can be really difficult. Remember that there are people who care about you, including me. Would you like to explore ways to connect with others?";
      } else {
        responseText = "Thank you for sharing. I'm here to listen and help. Can you tell me more about what you're going through?";
      }
    } else {
      responseText = "Hello! I'm here to listen and help. What's on your mind today?";
    }

    const response = {
      id: Date.now() + 1,
      text: responseText,
      sender: 'counselor',
      name: 'Sarah, Counselor',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, response]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
        anonymous: isAnonymous
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const startChat = () => {
    setIsConnected(true);
    const welcomeMessage = {
      id: Date.now(),
      text: "Hello! I'm Sarah, a licensed counselor. I'm here to listen and help. What's on your mind today?",
      sender: 'counselor',
      name: 'Sarah, Counselor',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  };

  const endChat = () => {
    setMessages([]);
    setIsConnected(false);
  };

  const reportIssue = () => {
    alert('Thank you for reporting an issue. Our team will review this conversation and take appropriate action.');
  };

  const sendQuickHelp = () => {
    const quickHelpOptions = [
      "Would you like to try a breathing exercise?",
      "I can share some resources that might help.",
      "Would it help to talk about something positive?",
      "Let's try to break down what you're feeling."
    ];
    
    const randomHelp = quickHelpOptions[Math.floor(Math.random() * quickHelpOptions.length)];
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: randomHelp,
      sender: 'counselor',
      name: 'Sarah, Counselor',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  return (
    <div className="live-chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Live Chat Support</h1>
          <div className="chat-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <span className="online-count">
              <i className="online-dot"></i> 
              {onlineCounselors} counselors online
            </span>
            
            {userRole === 'teen' && !isConnected && (
              <label className="anonymous-toggle">
                <input 
                  type="checkbox" 
                  checked={isAnonymous} 
                  onChange={() => setIsAnonymous(!isAnonymous)} 
                />
                <span className="toggle-slider"></span>
                Anonymous Chat
              </label>
            )}
          </div>
        </div>

        {!isConnected ? (
          <div className="chat-welcome">
            <div className="welcome-content">
              <h2>Get Immediate Support</h2>
              <p>Chat {isAnonymous ? 'anonymously' : ''} with licensed professionals who care about your well-being.</p>
              
              <div className="chat-features">
                <div className="feature">
                  <div className="feature-icon">🔒</div>
                  <h3>100% Private</h3>
                  <p>Your conversation is confidential</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">💬</div>
                  <h3>Real-time Support</h3>
                  <p>Get help when you need it most</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">👥</div>
                  <h3>Licensed Professionals</h3>
                  <p>Verified counselors and therapists</p>
                </div>
              </div>

              {userRole === 'teen' && (
                <>
                  <button className="start-chat-btn" onClick={startChat}>
                    Start Chat Now
                  </button>

                  <div className="counselor-selector">
                    <button 
                      className="view-counselors-btn"
                      onClick={() => setShowCounselorList(!showCounselorList)}
                    >
                      {showCounselorList ? 'Hide Available Counselors' : 'View Available Counselors'}
                    </button>

                    {showCounselorList && (
                      <div className="counselors-list">
                        <h4>Available Counselors</h4>
                        {counselors.filter(c => c.online).map(counselor => (
                          <div key={counselor.id} className="counselor-card">
                            <div className="counselor-avatar">
                              {counselor.name.charAt(0)}
                            </div>
                            <div className="counselor-info">
                              <h5>{counselor.name}</h5>
                              <p>{counselor.specialty}</p>
                              <div className="counselor-rating">
                                <span className="stars">★★★★★</span>
                                <span>{counselor.rating}</span>
                              </div>
                            </div>
                            <button className="select-counselor-btn">Select</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="safety-notice">
                <p>🚨 If you're in immediate danger, please call 911 or your local emergency number.</p>
                <p>National Suicide Prevention Lifeline: 1-800-273-8255</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-interface">
            <div className="messages-container">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender}`}>
                  {message.sender === 'counselor' && (
                    <div className="message-sender">{message.name}</div>
                  )}
                  
                  {message.sender === 'user' && !message.anonymous && (
                    <div className="message-sender">You</div>
                  )}
                  
                  {message.sender === 'user' && message.anonymous && (
                    <div className="message-sender">Anonymous</div>
                  )}
                  
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                </div>
              ))}
              
              {typing && (
                <div className="message counselor typing">
                  <div className="message-sender">Sarah, Counselor</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            <form className="message-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="message-input"
                disabled={userRole !== 'teen'}
              />
              <button type="submit" className="send-btn">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>

            <div className="chat-options">
              <button className="option-btn" onClick={endChat}>
                <i className="fas fa-phone-slash"></i> End Chat
              </button>
              
              {userRole === 'counselor' && (
                <button className="option-btn" onClick={sendQuickHelp}>
                  <i className="fas fa-lightbulb"></i> Quick Responses
                </button>
              )}
              
              <button className="option-btn" onClick={reportIssue}>
                <i className="fas fa-flag"></i> Report Issue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;