import express from 'express';
import Message from '../models/messageModel.js'; // Correctly import Message model

const router = express.Router();

// Get chat messages between student and mentor
router.post('/send', async (req, res) => {
    const { message, sender, receiver } = req.body;
  
    if (!message || !sender || !receiver) {
      return res.status(400).json({ error: 'Missing message, sender, or receiver' });
    }
  
    try {
      const newMessage = new Message({
        sender,
        receiver,
        message,
      });
  
      await newMessage.save(); // Save the message in the database
  
      // Return the saved message as the response
      res.status(200).json(newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Error saving message' });
    }
  });
  
router.get('/messages', async (req, res) => {
  const { sender, receiver } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 }); // Sort messages by timestamp

    res.json(messages); // Return the messages
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Error fetching messages');
  }
});

// Export router correctly
export default router; 