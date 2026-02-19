import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AuthRequest } from "../types/index";

// ── Helper: sign JWT ──────────────────────────────────────────
const signToken = (userId: string, role: string): string =>
  jwt.sign(
    { userId, role }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
  );

// ── POST /api/auth/register ───────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, phone, role } = req.body;

    // Only allow "seller" from public registration — admins are created internally
    if (role === "admin") {
      res.status(403).json({ success: false, message: "Cannot register as admin" });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ success: false, message: "Email already registered" });
      return;
    }

    const user = new User({
      email,
      password_hash: password,   // pre-save hook will hash it
      role: "seller",
      full_name,
      phone,
      is_email_verified: false,
      is_phone_verified: false,
      seller_profile: {
        verification_status: "pending",
        is_verified_badge: false,
      },
    });

    await user.save();

    // TODO: send email verification email here (Nodemailer / SendGrid / etc.)
    const token = signToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase(), is_active: true });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    await User.findByIdAndUpdate(user._id, { last_login: new Date() });

    const token = signToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_email_verified: user.is_email_verified,
        seller_profile: user.seller_profile,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select("-password_hash");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/auth/seller-profile ──────────────────────────────
// Seller uploads identity doc + selfie URL to complete their profile
export const updateSellerProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { identity_document, selfie_url } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      {
        $set: {
          "seller_profile.identity_document": identity_document,
          "seller_profile.selfie_url": selfie_url,
          "seller_profile.verification_status": "pending",
        },
      },
      { new: true, select: "-password_hash" }
    );

    res.json({ success: true, message: "Seller profile updated. Awaiting verification.", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
