import { Router } from "express";
import {
  getOrCreateConversation,
  listConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
} from "../controllers/chatController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);  // all chat routes require auth

router.get( "/unread-count",                   getUnreadCount);
router.get( "/conversations",                  listConversations);
router.post("/conversations",                  getOrCreateConversation);
router.get( "/conversations/:id/messages",     getMessages);
router.post("/conversations/:id/messages",     sendMessage);

export default router;
