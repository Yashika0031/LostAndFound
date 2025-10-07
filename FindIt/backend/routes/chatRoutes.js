import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkChatAccess } from '../middleware/chatMiddleware.js';
import { 
  getMessages,
  createMessage,
  markMessagesAsRead,
  getUnreadCount,
} from '../controllers/chatController.js';

const router = express.Router();

// Get unread messages count
router.get('/unread', protect, getUnreadCount);

// Get messages and send message routes
router.route('/:responseId')
  .get(protect, checkChatAccess, getMessages)
  .post(protect, checkChatAccess, createMessage);

// Mark messages as read
router.route('/:responseId/read')
  .put(protect, checkChatAccess, markMessagesAsRead);

export default router;