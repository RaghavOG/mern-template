import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: 'Hey There I am using this Chat Application' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  }],
  friendRequestsSent: [{
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'rejected'], default: 'pending' },
  }],
  onlineStatus: { type: Boolean, default: false },
  lastFriendRequest: { type: Date, default: null }, // New field for cooldown
}, { timestamps: true });

// Indexes
userSchema.index({ 'friendRequests.status': 1 });
userSchema.index({ 'friendRequests.from': 1 });
userSchema.index({ 'friendRequestsSent.to': 1 });
userSchema.index({ 'friendRequestsSent.status': 1 });
userSchema.index({ blockedUsers: 1 });
userSchema.index({ onlineStatus: 1 });
userSchema.index({ bio: 'text' }); // Text search for bio field

const User = mongoose.model('User', userSchema);
export default User;