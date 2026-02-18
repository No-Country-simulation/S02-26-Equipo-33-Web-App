import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/index.js";

const sellerProfileSchema = new Schema(
  {
    identity_document:   { type: String },
    selfie_url:          { type: String },
    verification_status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    verification_method: { type: String, enum: ["manual", "automatic"] },
    verified_at:         { type: Date },
    verified_by:         { type: Schema.Types.ObjectId, ref: "User" },
    rejection_reason:    { type: String },
    is_verified_badge:   { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["admin", "seller"], required: true },
    full_name: { type: String, required: [true, "Full name is required"], trim: true },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9][0-9]{7,14}$/, "Invalid phone format. Use international format: +5491112345678"],
    },
    is_email_verified:        { type: Boolean, default: false },
    is_phone_verified:        { type: Boolean, default: false },
    email_verification_token: { type: String },
    profile_picture_url:      { type: String },
    seller_profile:           { type: sellerProfileSchema, default: null },
    is_active:                { type: Boolean, default: true },
    last_login:               { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// ── Hash password before saving ────────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash when password_hash field is modified
  if (!this.isModified("password_hash")) return ;
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 12);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);

});

// ── Instance method: compare password ─────────────────────
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// ── Remove sensitive fields from JSON output ───────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  delete obj.email_verification_token;
  return obj;
};

export const User = model<IUser>("User", userSchema);
