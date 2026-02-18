import { Request } from "express";
import { Document, Types } from "mongoose";

// ── Auth ──────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  role: "admin" | "seller";
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ── User ──────────────────────────────────────────────────────
export interface ISellerProfile {
  identity_document?: string;
  selfie_url?: string;
  verification_status: "pending" | "verified" | "rejected";
  verification_method?: "manual" | "automatic";
  verified_at?: Date;
  verified_by?: Types.ObjectId;
  rejection_reason?: string;
  is_verified_badge: boolean;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password_hash: string;
  role: "admin" | "seller";
  full_name: string;
  phone?: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  email_verification_token?: string;
  profile_picture_url?: string;
  seller_profile?: ISellerProfile;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ── Horse ─────────────────────────────────────────────────────
export interface IPhoto {
  url: string;
  caption?: string;
  is_cover: boolean;
  uploaded_at: Date;
}

export interface IVideo {
  url: string;
  embed_url?: string;
  video_type: "training" | "competition" | "other";
  title?: string;
  description?: string;
  recorded_at: Date;
  uploaded_at: Date;
}

export interface ILocation {
  country: string;
  region: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
}

export interface IHorse extends Document {
  _id: Types.ObjectId;
  seller_id: Types.ObjectId;
  name: string;
  age: number;
  breed: string;
  discipline: string;
  pedigree?: string;
  location: ILocation;
  price?: number;
  currency?: string;
  photos: IPhoto[];
  videos: IVideo[];
  status: "active" | "sold" | "paused" | "draft";
  views_count: number;
  created_at: Date;
  updated_at: Date;
}

// ── Vet Record ────────────────────────────────────────────────
export interface IVaccine {
  name: string;
  applied_at: Date;
  next_due_at?: Date;
  batch_number?: string;
}

export interface IVetRecord extends Document {
  _id: Types.ObjectId;
  horse_id: Types.ObjectId;
  vet_id?: Types.ObjectId;
  review_date: Date;
  health_status: string;
  certificates: { url: string; title?: string; uploaded_at: Date }[];
  vaccines: IVaccine[];
  validation_status: "pending" | "validated" | "rejected";
  validated_by?: Types.ObjectId;
  validated_at?: Date;
  rejection_reason?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// ── Chat ──────────────────────────────────────────────────────
export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  horse_id?: Types.ObjectId;
  last_message?: {
    text: string;
    sender_id: Types.ObjectId;
    sent_at: Date;
    is_read: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversation_id: Types.ObjectId;
  sender_id: Types.ObjectId;
  text: string;
  is_read: boolean;
  read_at?: Date;
  sent_at: Date;
  deleted_at?: Date;
}
