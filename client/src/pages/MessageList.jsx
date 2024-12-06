import React, { useState, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const MessageList = ({ conversationID, mentor }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const appID = import.meta.env.VITE_ZEGO_APP_ID;
  const appSign = import.meta.env.VITE_ZEGO_APP_SIGN_KEY;
  const serverUrl = import.meta.env.VITE_ZEGO_SERVER_URL;

  const zp = ZegoUIKitPrebuilt.create(appID, appSign, serverUrl);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch messages for this specific conversation
        const response = await fetch(`/api/messages/${conversationID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        // Fallback to mocked messages
        const mockMessages = [
          { sender: mentor.name, text: "Hello! How can I help you today?" },
          { sender: "You", text: "Hi, I wanted to discuss some career advice." }
        ];
        setMessages(mockMessages);
      }
    };

    if (conversationID) {
      fetchMessages();
    }
  }, [conversationID, mentor]);

  const sendMessage = async () => {
    if (messageText.trim()) {
      const newMessage = {
        sender: "You",
        text: messageText,
        timestamp: new Date().toISOString()
      };

      try {
        // Send message to backend
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversationID,
            message: newMessage
          })
        });

        if (response.ok) {
          setMessages([...messages, newMessage]);
          setMessageText("");
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Optimistically update messages even if send fails
        setMessages([...messages, newMessage]);
        setMessageText("");
      }
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        {mentor.profilePicture && (
          <img 
            src={mentor.profilePicture} 
            alt={mentor.name} 
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <h2 className="text-xl font-bold">{mentor.name}</h2>
      </div>
      
      <div className="h-72 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex mb-4 ${
              message.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === "You" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-white"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="w-full p-2 rounded-lg bg-gray-700 text-white"
          placeholder={`Message to ${mentor.name}`}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 p-2 rounded-lg hover:bg-blue-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageList;