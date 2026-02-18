// ── VetRecord Model ───────────────────────────────────────────
import { Schema, model } from "mongoose";
import { IConversation, IMessage, IVetRecord } from "../types/index.js";

const vaccineSchema = new Schema(
  {
    name:         { type: String, required: true },
    applied_at:   { type: Date, required: true },
    next_due_at:  { type: Date },
    batch_number: { type: String },
  },
  { _id: false }
);

const certificateSchema = new Schema(
  {
    url:         { type: String, required: true },
    title:       { type: String },
    uploaded_at: { type: Date, default: () => new Date() },
  },
  { _id: true }
);

const vetRecordSchema = new Schema<IVetRecord>(
  {
    horse_id:         { type: Schema.Types.ObjectId, ref: "Horse", required: true, index: true },
    vet_id:           { type: Schema.Types.ObjectId, ref: "User" },
    review_date:      { type: Date, required: true },
    health_status:    { type: String, required: true },
    certificates:     { type: [certificateSchema], default: [] },
    vaccines:         { type: [vaccineSchema], default: [] },
    validation_status:{ type: String, enum: ["pending", "validated", "rejected"], default: "pending" },
    validated_by:     { type: Schema.Types.ObjectId, ref: "User" },
    validated_at:     { type: Date },
    rejection_reason: { type: String },
    notes:            { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const VetRecord = model<IVetRecord>("VetRecord", vetRecordSchema);

// ── Conversation Model ────────────────────────────────────────
const lastMessageSchema = new Schema(
  {
    text:      { type: String },
    sender_id: { type: Schema.Types.ObjectId, ref: "User" },
    sent_at:   { type: Date },
    is_read:   { type: Boolean, default: false },
  },
  { _id: false }
);

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
      validate: {
        validator: (arr: unknown[]) => arr.length === 2,
        message: "A conversation requires exactly 2 participants",
      },
    },
    horse_id:     { type: Schema.Types.ObjectId, ref: "Horse" },
    last_message: { type: lastMessageSchema },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

conversationSchema.index({ participants: 1 });

export const Conversation = model<IConversation>("Conversation", conversationSchema);

// ── Message Model ─────────────────────────────────────────────
const messageSchema = new Schema<IMessage>(
  {
    conversation_id: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    sender_id:       { type: Schema.Types.ObjectId, ref: "User", required: true },
    text:            { type: String, required: true, maxlength: 2000 },
    is_read:         { type: Boolean, default: false },
    read_at:         { type: Date },
    deleted_at:      { type: Date },
  },
  {
    timestamps: { createdAt: "sent_at", updatedAt: false },
  }
);

export const Message = model<IMessage>("Message", messageSchema);
