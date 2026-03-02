import { Schema, model } from "mongoose";
import { IHorse } from "../types/index";

const photoSchema = new Schema(
  {
    url:         { type: String, required: true },
    caption:     { type: String },
    is_cover:    { type: Boolean, default: false },
    uploaded_at: { type: Date, default: () => new Date() },
  },
  { _id: true }
);

const videoSchema = new Schema(
  {
    url:         { type: String, required: true },
    embed_url:   { type: String },
    video_type:  { type: String, enum: ["training", "competition", "other"], required: true },
    title:       { type: String },
    description: { type: String },
    recorded_at: { type: Date, required: true },
    uploaded_at: { type: Date, default: () => new Date() },
  },
  { _id: true }
);

const locationSchema = new Schema(
  {
    country:     { type: String, required: true },
    region:      { type: String, required: true },
    city:        { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
);

const horseSchema = new Schema<IHorse>(
  {
    seller_id:  { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name:       { type: String, required: [true, "Horse name is required"], trim: true },
    age:        { type: Number, required: true, min: 0, max: 40 },
    breed:      { type: String, required: [true, "Breed is required"], trim: true },
    discipline: { type: String, required: [true, "Discipline is required"], trim: true },
    pedigree:   { type: String },
    location:   { type: locationSchema, required: true },
    price:      { type: Number, min: 0 },
    currency:   { type: String, enum: ["USD", "EUR", "ARS", "BRL", "MXN"], default: "USD" },
    photos: {
      type: [photoSchema],
      validate: {
        validator: (photos: unknown[]) => photos.length >= 3,
        message: "At least 3 photos are required",
      },
    },
    videos:      { type: [videoSchema], default: [] },
    status:      { type: String, enum: ["active", "sold", "paused", "draft"], default: "draft" },
    views_count: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Full-text search index
horseSchema.index(
  { name: "text", breed: "text", discipline: "text", pedigree: "text" },
  { default_language: "spanish" }
);

// ── Auto-generate embed_url from YouTube / Vimeo URLs ─────
horseSchema.pre("save", function (next) {
  this.videos = this.videos.map((video) => {
    if (!video.embed_url && video.url) {
      video.embed_url = toEmbedUrl(video.url);
    }
    return video;
  });
});

function toEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export const Horse = model<IHorse>("Horse", horseSchema);
