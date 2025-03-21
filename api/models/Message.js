import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { 
    type: String, 
    required: true 
  },
  receiver: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true // This adds createdAt and updatedAt fields
});

const Message = mongoose.model('Message', messageSchema);

export default Message;