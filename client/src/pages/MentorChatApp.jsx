import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const socket = io(BASE_URL);

const MentorChatApp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { studentId } = useParams();
  
  const [students, setStudents] = useState([]); 
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [messages, setMessages] = useState([]);  
  const [message, setMessage] = useState('');  
  const [studentDetails, setStudentDetails] = useState(null);  

  useEffect(() => {
    const fetchStudentsWithDetails = async () => {
      try {
        const notificationResponse = await fetch(`${BASE_URL}/api/chat/notifications`);
        const notificationData = await notificationResponse.json();
   
        const studentsWithDetails = await Promise.all(
          notificationData
            .map(student => {
              const role = student.role ? student.role.toLowerCase() : '';
   
              // Check for existing messages
              if (student.username !== currentUser.username && role !== 'mentor') {
                return fetch(`${BASE_URL}/api/chat/messages?sender=${student.username}&receiver=${currentUser.username}`)
                  .then(messageResponse => messageResponse.json())
                  .then(messagesData => {
                    if (messagesData.length > 0) {
                      return fetch(`${BASE_URL}/api/chat/${student.username}`)
                        .then(detailResponse => detailResponse.json())
                        .catch(() => ({
                          ...student,
                          profilePicture: 'https://via.placeholder.com/150',
                          email: 'No email available',
                        }));
                    }
                    return null; // Skip students who haven't sent any message
                  })
                  .catch(() => null);
              }
              return null;
            })
        );
   
        const filteredStudents = studentsWithDetails.filter(student => student !== null);
        setStudents(filteredStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      }
    };
   
  
    if (currentUser) {
      fetchStudentsWithDetails();
    }
  }, [currentUser]);
  

  const fetchStudentDetails = useCallback(async (studentUsername) => {
    if (studentUsername) {
      try {
        // Fetch basic student data
        const response = await fetch(`${BASE_URL}/api/chat/${studentUsername}`);
        const studentData = await response.json();
        
        // Check if the student is a mentor and if so, return early
        if (studentData.role && studentData.role.toLowerCase() === 'mentor') {
          setStudentDetails(null); // Or handle this case as needed
          return; // Prevent further fetching for mentors
        }
        
        setStudentDetails(studentData);
      } catch (error) {
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

  const handleNewMessage = useCallback(
    (newMessage) => {
      if (newMessage.receiver === currentUser.username) {
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
      <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col shadow-lg">
  <h2 className="text-lg font-semibold border-b-2 pb-2 mb-4 text-gray-300">Students</h2>
  <ul className="mt-2 space-y-2 overflow-y-auto">
    {students
      .filter(student => student.role !== 'mentor') // Filter students based on role
      .map((student, index) => (
        <li
          key={index}
          className={`p-3 rounded-md cursor-pointer hover:bg-blue-700 transition duration-200 ease-in-out ${selectedStudent?.username === student.username ? 'bg-blue-700' : ''}`}
          onClick={() => setSelectedStudent(student)}
        >
          <div className="flex items-center">
            <img
              src={student.profilePicture || 'https://via.placeholder.com/150'}
              alt="Student"
              className="w-12 h-12 rounded-full mr-4 border-2 border-gray-500"
            />
            <span className="text-lg font-medium text-gray-200">{student.username}</span>
          </div>
        </li>
      ))}
  </ul>
</div>

      {/* Main chat area */}
      <div className="flex-1 p-8">
        {selectedStudent ? (
          <div className="bg-white rounded-lg shadow-xl max-w-xl mx-auto p-6">
            {/* Chat Header */}
  
            <div className="flex items-center mb-6 border-b pb-4 bg-gray-800 text-white rounded-t-lg shadow-md p-4">
           
    <img
      src={selectedStudent.profilePicture || 'https://via.placeholder.com/150'}
      alt="Student Profile"
      className="w-16 h-16 rounded-full mr-4"
    />
  
  <div>
    <p className="text-3xl font-bold text-gray-200 hover:text-blue-400 transition duration-300 ease-in-out">
      {selectedStudent.username}
    </p>
    <p className="text-gray-400 italic mt-1">{selectedStudent.email || 'No email available'}</p>
  </div>
</div>


            {/* Chat Messages */}
            <div className="space-y-4 mb-4 overflow-y-auto h-72">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start ${msg.sender === currentUser.username ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Profile picture for other user */}
                  {msg.sender !== currentUser.username && selectedStudent.profilePicture && (
                    <img
                      src={selectedStudent.profilePicture}
                      alt={`${msg.sender}'s avatar`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 mr-3"
                    />
                  )}

                  {/* Message bubble */}
                  <div
                    className={`p-3 max-w-xs rounded-lg ${msg.sender === currentUser.username ? 'bg-blue-100' : 'bg-green-100'}`}
                  >
                    <strong className="text-sm block mb-1">
                      {msg.sender === currentUser.username ? 'You' : msg.sender}
                    </strong>
                    <p className="text-gray-800">{msg.message}</p>
                  </div>

                  {/* Profile picture for current user */}
                  {msg.sender === currentUser.username && currentUser.profilePicture && (
                    <img
                      src={currentUser.profilePicture}
                      alt={`${currentUser.username}'s avatar`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 ml-3"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-center mt-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-700">Select a student to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorChatApp;
