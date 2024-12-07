import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users involved in the chat
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Reference to the last message
  }, { timestamps: true });
  
const Chat =  mongoose.model('Chat', chatSchema);
  
export default Chat;