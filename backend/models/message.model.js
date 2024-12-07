import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true }, // Reference to the chat
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender of the message
  content: { type: String }, // Message text
  mediaUrl: { type: String }, // URL for media (image, video, PDF)
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who have read this message
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;