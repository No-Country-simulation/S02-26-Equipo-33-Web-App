import "dotenv/config";
import http from "http";
import { Server as SocketServer, Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import app from "./app.js";
import connectDB from "./config/db.js";
import { Conversation, Message } from "./models/VetRecord.js";

const PORT = process.env.PORT || 3000;

// ── HTTP server ───────────────────────────────────────────────
const httpServer = http.createServer(app);

// ── Socket.io setup ───────────────────────────────────────────
const io = new SocketServer(httpServer, {
  cors: {
    origin: (process.env.CORS_ORIGINS || "http://localhost:5173").split(","),
    credentials: true,
  },
});

// ── Socket.io JWT authentication middleware ───────────────────
io.use((socket: Socket, next) => {
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) {
    return next(new Error("Authentication error: no token"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    (socket as Socket & { user: JwtPayload }).user = decoded;
    next();
  } catch {
    next(new Error("Authentication error: invalid token"));
  }
});

// ── Socket.io event handlers ──────────────────────────────────
io.on("connection", (socket: Socket) => {
  const user = (socket as Socket & { user: JwtPayload }).user;
  console.log(`🔌 Socket connected: userId=${user.userId}`);

  // Join a room per user (so we can target recipients)
  socket.join(`user:${user.userId}`);

  // ── Join a conversation room ──────────────────────────────
  socket.on("join_conversation", (conversationId: string) => {
    socket.join(`conv:${conversationId}`);
    console.log(`  User ${user.userId} joined conv:${conversationId}`);
  });

  // ── Send a message via socket ─────────────────────────────
  socket.on(
    "send_message",
    async (data: { conversation_id: string; text: string }, ack?: (res: unknown) => void) => {
      try {
        // Verify user is participant
        const conversation = await Conversation.findOne({
          _id: data.conversation_id,
          participants: user.userId,
        });

        if (!conversation) {
          if (ack) ack({ success: false, message: "Conversation not found" });
          return;
        }

        // Persist to DB
        const message = await Message.create({
          conversation_id: data.conversation_id,
          sender_id: user.userId,
          text: data.text,
          is_read: false,
        });

        // Update last_message snapshot
        await Conversation.findByIdAndUpdate(data.conversation_id, {
          last_message: {
            text: data.text,
            sender_id: user.userId,
            sent_at: message.sent_at,
            is_read: false,
          },
          updated_at: new Date(),
        });

        const populated = await message.populate("sender_id", "full_name profile_picture_url");

        // Emit to all in the conversation room
        io.to(`conv:${data.conversation_id}`).emit("new_message", populated);

        // Also notify recipient's personal room (for badge/notification)
        const recipientId = conversation.participants.find(
          (p) => p.toString() !== user.userId
        );
        if (recipientId) {
          io.to(`user:${recipientId}`).emit("message_notification", {
            conversation_id: data.conversation_id,
            sender: user.userId,
            preview: data.text.substring(0, 60),
          });
        }

        if (ack) ack({ success: true, data: populated });
      } catch (err) {
        console.error("Socket send_message error:", err);
        if (ack) ack({ success: false, message: "Error sending message" });
      }
    }
  );

  // ── Typing indicator ──────────────────────────────────────
  socket.on("typing", (conversationId: string) => {
    socket.to(`conv:${conversationId}`).emit("user_typing", { userId: user.userId });
  });

  socket.on("stop_typing", (conversationId: string) => {
    socket.to(`conv:${conversationId}`).emit("user_stop_typing", { userId: user.userId });
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: userId=${user.userId}`);
  });
});

// ── Start server ──────────────────────────────────────────────
const start = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.io ready`);
    console.log(`🌱 Environment: ${process.env.NODE_ENV}\n`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down...");
    httpServer.close(() => process.exit(0));
  });
};

start();
