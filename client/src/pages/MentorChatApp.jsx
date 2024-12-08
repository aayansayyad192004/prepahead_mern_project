import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:10000'); // Connect to the backend socket server

const MentorChatApp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [students, setStudents] = useState([]); 
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [messages, setMessages] = useState([]);  
  const [message, setMessage] = useState('');  
  const [studentDetails, setStudentDetails] = useState(null);  

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:10000/api/chat/notifications');
        const data = await response.json();
        const filteredStudents = data.filter(student => student.username !== currentUser.username);
        setStudents(filteredStudents);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (selectedStudent && selectedStudent._id) {
        try {
          const response = await fetch(`http://localhost:10000/api/students/${selectedStudent._id}`);
          const data = await response.json();
          console.log(data);  // Log the response to verify if profilePicture and email are available
          setStudentDetails(data);
        } catch (error) {
          console.error('Error fetching student details:', error);
        }
      }
    };
    
    fetchStudentDetails();
  }, [selectedStudent]);

  const handleNewMessage = useCallback(
    (newMessage) => {
      if (newMessage.receiver === currentUser.username) {
        if (newMessage.sender !== currentUser.username) {
          setStudents((prevStudents) => {
            if (!prevStudents.some((student) => student.username === newMessage.sender)) {
              return [...prevStudents, { username: newMessage.sender }];
            }
            return prevStudents;
          });
        }
        if (selectedStudent && newMessage.sender === selectedStudent.username) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      }
    },
    [currentUser.username, selectedStudent]
  );

  useEffect(() => {
    socket.on('receiveMessage', handleNewMessage);
    return () => socket.off('receiveMessage', handleNewMessage);
  }, [handleNewMessage]);

  useEffect(() => {
    if (selectedStudent) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:10000/api/chat/messages?sender=${selectedStudent.username}&receiver=${currentUser.username}`
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedStudent, currentUser]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedStudent) {
      const messageData = {
        message,
        sender: currentUser.username,
        receiver: selectedStudent.username,
      };
      socket.emit('sendMessage', messageData);

      try {
        const response = await fetch('http://localhost:10000/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          throw new Error('Error saving message');
        }

        setMessages((prev) => [...prev, messageData]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for students */}
      <div className="w-1/4 bg-white shadow-lg border-r">
        <h2 className="text-lg font-bold p-4 border-b bg-gray-200 text-gray-800">Students</h2>
        <ul className="p-4">
          {students.map((student, index) => (
            <li
              key={index}
              className={`p-2 rounded-md mb-2 cursor-pointer hover:bg-gray-300 ${selectedStudent?.username === student.username ? 'bg-gray-300 font-bold' : ''}`}
              onClick={() => setSelectedStudent(student)}
            >
              {student.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedStudent ? (
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">Chat with: {selectedStudent.username}</h2>
            <div className="flex items-center mb-4">
              <img
                src={studentDetails ? studentDetails.profilePicture : ''}
                alt="Student Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{selectedStudent.username}</p>
                <p>{studentDetails ? studentDetails.email : ''}</p>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <h3 className="font-semibold">Messages:</h3>
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <strong className={`text-${msg.sender === currentUser.username ? 'green' : 'blue'}-500`}>
                      {msg.sender}:
                    </strong>
                    <span className="text-gray-700">{msg.message}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-full"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-lg font-bold text-gray-800">Select a student to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorChatApp;
