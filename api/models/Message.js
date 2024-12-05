import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: String, // sender's username
  receiver: String, // receiver's username
  message: String, // message content
  timestamp: { type: Date, default: Date.now }, // when the message was sent
});

const Message = mongoose.model('Message', MessageSchema);
export default Message;
