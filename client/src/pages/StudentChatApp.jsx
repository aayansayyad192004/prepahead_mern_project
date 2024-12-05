import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:10000');

const StudentChatApp = ({ mentorId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch previous messages
    const fetchMessages = async () => {
      const response = await fetch(
        `http://localhost:10000/api/messages?sender=${currentUser.username}&receiver=${mentorId}`
      );
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();

    socket.on('receiveMessage', (newMessage) => {
      if (
        (newMessage.sender === currentUser.username && newMessage.receiver === mentorId) ||
        (newMessage.sender === mentorId && newMessage.receiver === currentUser.username)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, mentorId]);

  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      const messageData = {
        sender: currentUser.username,
        receiver: mentorId,
        message,
      };

      socket.emit('sendMessage', messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage('');
    }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <h3>Chat with {mentorId}</h3>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default StudentChatApp;
