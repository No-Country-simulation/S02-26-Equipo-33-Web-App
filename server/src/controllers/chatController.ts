import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../types/index.js";
import { Conversation, Message} from "../models/VetRecord.js";

// ── POST /api/chat/conversations ──────────────────────────────
// Start or retrieve a conversation between current user and another user
// Optionally linked to a horse listing (contact seller about a horse)
export const getOrCreateConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recipient_id, horse_id } = req.body;
    const currentUserId = req.user?.userId as string;

    if (!Types.ObjectId.isValid(recipient_id)) {
      res.status(400).json({ success: false, message: "Invalid recipient ID" });
      return;
    }

    if (currentUserId === recipient_id) {
      res.status(400).json({ success: false, message: "Cannot message yourself" });
      return;
    }

    const participants = [
      new Types.ObjectId(currentUserId),
      new Types.ObjectId(recipient_id),
    ];

    // Look for existing conversation between these two users (optionally about same horse)
    const existingQuery: Record<string, unknown> = {
      participants: { $all: participants },
    };
    if (horse_id) existingQuery.horse_id = horse_id;

    let conversation = await Conversation.findOne(existingQuery);

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        horse_id: horse_id ? new Types.ObjectId(horse_id) : undefined,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    res.json({ success: true, data: conversation });
  } catch (err) {
    console.error("getOrCreateConversation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/chat/conversations ───────────────────────────────
// List all conversations for the current user
export const listConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.user?.userId);

    const conversations = await Conversation.find({ participants: userId })
      .sort({ updated_at: -1 })
      .populate("participants", "full_name profile_picture_url seller_profile.is_verified_badge")
      .populate("horse_id", "name photos");

    res.json({ success: true, data: conversations });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/chat/conversations/:id/messages ─────────────────
// Get message history (paginated)
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { page = "1", limit = "30" } = req.query as Record<string, string>;

    const conversation = await Conversation.findOne({
      _id: id,
      participants: new Types.ObjectId(req.user?.userId),
    });

    if (!conversation) {
      res.status(404).json({ success: false, message: "Conversation not found" });
      return;
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));

    const messages = await Message.find({
      conversation_id: id,
      deleted_at: { $exists: false },
    })
      .sort({ sent_at: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("sender_id", "full_name profile_picture_url");

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversation_id: id,
        sender_id: { $ne: new Types.ObjectId(req.user?.userId) },
        is_read: false,
      },
      { $set: { is_read: true, read_at: new Date() } }
    );

    res.json({ success: true, data: messages.reverse() });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/chat/conversations/:id/messages ────────────────
// Send a message (also used as fallback if Socket.io not available)
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const conversation = await Conversation.findOne({
      _id: id,
      participants: new Types.ObjectId(req.user?.userId),
    });

    if (!conversation) {
      res.status(404).json({ success: false, message: "Conversation not found" });
      return;
    }

    const message = await Message.create({
      conversation_id: id,
      sender_id: req.user?.userId,
      text,
      is_read: false,
    });

    // Update last_message snapshot on the conversation
    await Conversation.findByIdAndUpdate(id, {
      last_message: {
        text,
        sender_id: req.user?.userId,
        sent_at: message.sent_at,
        is_read: false,
      },
      updated_at: new Date(),
    });

    res.status(201).json({ success: true, data: message });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/chat/unread-count ────────────────────────────────
export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.user?.userId);

    // Get user's conversations
    const convIds = (
      await Conversation.find({ participants: userId }).select("_id")
    ).map((c: { _id: any; }) => c._id);

    const count = await Message.countDocuments({
      conversation_id: { $in: convIds },
      sender_id: { $ne: userId },
      is_read: false,
    });

    res.json({ success: true, unread_count: count });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
