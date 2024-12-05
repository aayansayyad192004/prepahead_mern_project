import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

const MentorChatApp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Fetch students
    const studentsRef = collection(db, 'users');
    const q = query(studentsRef, where('role', '==', 'student'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !selectedStudent) return;

    // Create unique chat room ID
    const chatRoomId = [currentUser.username, selectedStudent.username]
      .sort()
      .join('_');

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef, 
      where('chatRoomId', '==', chatRoomId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [currentUser, selectedStudent]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedStudent) return;

    const chatRoomId = [currentUser.username, selectedStudent.username]
      .sort()
      .join('_');

    try {
      await addDoc(collection(db, 'messages'), {
        chatRoomId,
        senderId: currentUser.username,
        text: message,
        timestamp: new Date(),
        senderType: 'mentor'
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {currentUser.username}</h2>

        {/* Mentor Profile */}
        <div className="flex items-center mb-4">
          <img
            src={currentUser.profilePicture || '/placeholder.png'}
            alt="Mentor Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">{currentUser.username}</p>
            <p>{currentUser.email}</p>
          </div>
        </div>

        {/* Select Student */}
        <div className="mb-4">
          <h3 className="font-semibold">Select a Student:</h3>
          <select
            onChange={(e) => setSelectedStudent(JSON.parse(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg w-full"
          >
            <option value="">-- Select a Student --</option>
            {students.map((student) => (
              <option key={student.username} value={JSON.stringify(student)}>
                {student.username}
              </option>
            ))}
          </select>
        </div>

        {/* Messages Section */}
        <div className="space-y-4 mb-4 h-64 overflow-y-auto">
          <h3 className="font-semibold">Messages:</h3>
          {selectedStudent ? (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <strong
                    className={`${
                      msg.senderId === currentUser.username 
                        ? 'text-green-500' 
                        : 'text-blue-500'
                    }`}
                  >
                    {msg.senderId}:
                  </strong>
                  <span className="text-gray-700">{msg.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Select a student to view messages</p>
          )}
        </div>

        {/* Message Input */}
        <div className="flex flex-col items-center space-y-4 mt-4">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
            disabled={!selectedStudent}
          />
          <button
            onClick={handleSendMessage}
            disabled={!selectedStudent}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChatApp;