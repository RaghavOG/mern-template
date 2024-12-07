import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getMessages, sendMessage, markMessageRead } from '../controllers/message.controller.js';

const router = express.Router();

// Get all messages for a specific chat
router.get("/:id", protectRoute, getMessages);

// Send a message to a specific chat
router.post("/send/:id", protectRoute, sendMessage);

// Mark a message as read
router.put("/read/:id", protectRoute, markMessageRead);

export default router;
