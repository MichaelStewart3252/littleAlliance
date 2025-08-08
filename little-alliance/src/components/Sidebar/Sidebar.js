import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Sidebar.css';

const SOCKET_SERVER_URL = "http://localhost:5000";

function Sidebar({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef();
  const chatEndRef = useRef();

  useEffect(() => {
    if (!user || !user.token) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(SOCKET_SERVER_URL, {
      auth: { token: user.token }
    });

    socketRef.current.onAny((event, ...args) => {
      console.log('Socket.IO event received:', event, args);
    });

    socketRef.current.on('connect', () => {
      console.log('Socket.IO connected!');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });

    socketRef.current.on('chat history', (msgs) => {
      setMessages(msgs);
    });

    socketRef.current.on('chat message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    if (!socketRef.current || socketRef.current.disconnected) {
      alert('Not connected to chat server.');
      return;
    }
    socketRef.current.emit('chat message', { text: input });
    setInput('');
  };

  if (!user || !user.token) {
    return (
      <aside className="sidebar">
        <div className="chat-box">
          <h3>Chat</h3>
          <p>
            You must <a href="/login">sign in</a> to use the chat.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="chat-box">
        <h3>Chat</h3>
        <div
          className="chat-messages"
          style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 8 }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} className="chat-message">
              <div className="chat-meta">
                <strong>{msg.username}</strong>
                <span style={{ marginLeft: '8px', color: '#888', fontSize: '0.85em' }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div>{msg.text}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSend} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </aside>
  );
}

export default Sidebar;
