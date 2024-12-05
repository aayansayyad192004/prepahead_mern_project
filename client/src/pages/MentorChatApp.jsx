import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:10000');

const MentorChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const [students, setStudents] = useState(['student1', 'student2']); // Replace with actual logic

  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    if (currentChat) {
      // Fetch previous messages
      const fetchMessages = async () => {
        const response = await fetch(
          `http://localhost:10000/api/messages?sender=${currentUser.username}&receiver=${currentChat}`
        );
        const data = await response.json();
        setMessages(data);
      };

      fetchMessages();
    }

    socket.on('receiveMessage', (newMessage) => {
      if (
        (newMessage.sender === currentUser.username && newMessage.receiver === currentChat) ||
        (newMessage.sender === currentChat && newMessage.receiver === currentUser.username)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, currentChat]);

  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      const messageData = {
        sender: currentUser.username,
        receiver: currentChat,
        message,
      };

      socket.emit('sendMessage', messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage('');
    }
  };

  return (
    <div>
      <h3>Mentor Chat</h3>
      <div>
        <h4>Students</h4>
        <ul>
          {students.map((student) => (
            <li key={student} onClick={() => setCurrentChat(student)}>
              {student}
            </li>
          ))}
        </ul>
      </div>
      {currentChat && (
        <div>
          <h4>Chat with {currentChat}</h4>
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
      )}
    </div>
  );
};

export default MentorChatApp;
