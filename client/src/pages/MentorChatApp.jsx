import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:10000';
const socket = io(BASE_URL);

const MentorChatApp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { studentId } = useParams();
  
  const [students, setStudents] = useState([]); 
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [messages, setMessages] = useState([]);  
  const [message, setMessage] = useState('');  
  const [studentDetails, setStudentDetails] = useState(null);  

  // Fetch list of students with full details
  useEffect(() => {
    const fetchStudentsWithDetails = async () => {
      try {
        // Fetch notifications first to get usernames
        const notificationResponse = await fetch(`${BASE_URL}/api/chat/notifications`);
        const notificationData = await notificationResponse.json();
        
        // Fetch full details for each student
        const studentsWithDetails = await Promise.all(
          notificationData
            .filter(student => student.username !== currentUser.username)
            .map(async (student) => {
              try {
                const detailResponse = await fetch(`${BASE_URL}/api/chat/${student.username}`);
                if (!detailResponse.ok) {
                  console.error(`Failed to fetch details for ${student.username}`);
                  return {
                    ...student, 
                    profilePicture: 'https://via.placeholder.com/150',
                    email: 'No email available'
                  };
                }
                return await detailResponse.json();
              } catch (error) {
                console.error(`Error fetching details for ${student.username}:`, error);
                return {
                  ...student, 
                  profilePicture: 'https://via.placeholder.com/150',
                  email: 'No email available'
                };
              }
            })
        );
        
        setStudents(studentsWithDetails);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setStudents([]);
      }
    };

    if (currentUser) {
      fetchStudentsWithDetails();
    }
  }, [currentUser]);

  // Fetch selected student details and messages
  const fetchStudentDetails = useCallback(async (studentUsername) => {
    if (studentUsername) {
      try {
        const response = await fetch(`${BASE_URL}/api/chat/${studentUsername}`);
        if (!response.ok) {
          throw new Error('Error fetching student details');
        }
        const studentData = await response.json();
        setStudentDetails(studentData);
      } catch (error) {
        console.error('Error fetching student details:', error);
        setStudentDetails({
          profilePicture: 'https://via.placeholder.com/150',
          email: 'No email available'
        });
      }
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    if (selectedStudent && currentUser) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/chat/messages?sender=${selectedStudent.username}&receiver=${currentUser.username}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  }, [selectedStudent, currentUser]);

  // Listen for incoming messages
  const handleNewMessage = useCallback(
    (newMessage) => {
      if (newMessage.receiver === currentUser.username) {
        // Add the new message to the messages list for the selected student
        if (newMessage.sender === selectedStudent?.username) {
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

  // Fetch messages and student details when a new student is selected
  useEffect(() => {
    if (selectedStudent) {
      fetchMessages();
      fetchStudentDetails(selectedStudent.username);
    }
  }, [selectedStudent, fetchMessages, fetchStudentDetails]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedStudent) {
      const messageData = {
        message,
        sender: currentUser.username,
        receiver: selectedStudent.username,
      };
      socket.emit('sendMessage', messageData);

      try {
        const response = await fetch(`${BASE_URL}/api/chat/send`, {
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
                src={selectedStudent.profilePicture || 'https://via.placeholder.com/150'}
                alt="Student Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{selectedStudent.username}</p>
                <p>{selectedStudent.email || 'No email available'}</p>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <h3 className="font-semibold">Messages:</h3>
              <div className="space-y-2">
              {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  msg.sender === currentUser.username ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`
                  p-2 rounded max-w-[70%]
                  ${msg.sender === currentUser.username 
                    ? 'bg-blue-100 text-right' 
                    : 'bg-green-100 text-left'}
                `}>
                  <strong className={`text-sm block mb-1 ${
                    msg.sender === currentUser.username ? 'text-blue-700' : 'text-green-700'
                  }`}>
                    {msg.sender === currentUser.username ? 'You' : msg.sender}
                  </strong>
                  <span className="text-gray-800">{msg.message}</span>
                </div>
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
