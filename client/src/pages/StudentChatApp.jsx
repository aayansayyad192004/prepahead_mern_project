import React, { useState, useEffect } from 'react';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { app } from '../firebase';

const db = getFirestore(app);

const StudentChatApp = ({ mentorId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [mentorInfo, setMentorInfo] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch mentor info
    const fetchMentorInfo = async () => {
      try {
        const mentorsRef = collection(db, 'users');
        const q = query(mentorsRef, where('username', '==', mentorId));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const mentors = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMentorInfo(mentors[0]);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching mentor info:', error);
      }
    };

    fetchMentorInfo();

    // Listen for messages
    if (currentUser && mentorId) {
      const chatRoomId = [currentUser.username, mentorId]
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
    }
  }, [currentUser, mentorId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser || !mentorId) return;

    const chatRoomId = [currentUser.username, mentorId]
      .sort()
      .join('_');

    try {
      await addDoc(collection(db, 'messages'), {
        chatRoomId,
        senderId: currentUser.username,
        text: message,
        timestamp: new Date(),
        senderType: 'student'
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!currentUser || !mentorInfo) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {currentUser.username}</h2>

        <div className="flex items-center mb-4">
          <img
            src={currentUser?.profilePicture || '/placeholder.png'}
            alt="Student Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">{currentUser.username}</p>
            <p>{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <img
            src={mentorInfo?.profilePicture || '/placeholder.png'}
            alt="Mentor Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">{mentorInfo?.username || 'Loading...'}</p>
            <p>{mentorInfo?.email || 'Loading...'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-4 h-64 overflow-y-auto">
          <h3 className="font-semibold">Messages:</h3>
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
    </div>
  );
};

export default StudentChatApp;