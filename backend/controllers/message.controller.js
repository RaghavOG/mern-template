import Message from '../models/message.model.js';
import Chat from '../models/chat.model.js';
import logger from '../utils/logger.js'; // Assuming you have a logger for logging actions

// Get all messages for a specific chat
export const getMessages = async (req, res) => {
    try {
        const chatId = req.params.id;
        const messages = await Message.find({ chatId })
            .populate('sender', 'username profilePicture') // Populate sender details
            .populate('readBy', 'username') // Populate who has read the message
            .sort({ createdAt: 1 }); // Sort messages by creation date ascending

        if (!messages) {
            return res.status(404).json({ success: false, message: "No messages found" });
        }

        res.status(200).json({ success: true, messages });
    } catch (error) {
        logger.error(`Error getting messages: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Send a message to a specific chat
export const sendMessage = async (req, res) => {
    try {
        const { content, mediaUrl } = req.body;
        const chatId = req.params.id;
        const sender = req.user.id;

        // Check if chat exists
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        // Create new message
        const newMessage = new Message({
            chatId,
            sender,
            content,
            mediaUrl,
        });

        await newMessage.save();

        // Optionally, mark the message as read by the sender immediately
        newMessage.readBy.push(sender);
        await newMessage.save();

        logger.info(`User ${sender} sent a message in chat ${chatId} at ${new Date().toISOString()}`);

        res.status(201).json({ success: true, message: "Message sent", newMessage });
    } catch (error) {
        logger.error(`Error sending message: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Mark a message as read by a user
export const markMessageRead = async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.user.id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        // If the user has not already read the message, add them to the readBy array
        if (!message.readBy.includes(userId)) {
            message.readBy.push(userId);
            await message.save();

            logger.info(`User ${userId} marked message ${messageId} as read`);
        }

        res.status(200).json({ success: true, message: "Message marked as read" });
    } catch (error) {
        logger.error(`Error marking message as read: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
