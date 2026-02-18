import { Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/User.js";
import { Horse } from "../models/Horse.js";
import { VetRecord } from "../models/VetRecord.js";
import { AuthRequest } from "../types/index.js";
// import { AuthRequest } from "../types.js";

// ── GET /api/admin/sellers/pending ────────────────────────────
export const getPendingSellers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sellers = await User.find({
      role: "seller",
      "seller_profile.verification_status": "pending",
    }).select("email full_name phone seller_profile created_at");

    res.json({ success: true, data: sellers });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/admin/sellers/:id/verify ────────────────────────
export const verifySeller = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action, rejection_reason } = req.body;  // action: "approve" | "reject"

     if (!Types.ObjectId.isValid( `${id}` )) {
       res.status(400).json({ success: false, message: "Invalid user ID" });
       return;
     }
    if (!["approve", "reject"].includes(action)) {
      res.status(400).json({ success: false, message: "action must be 'approve' or 'reject'" });
      return;
    }

    const update =
      action === "approve"
        ? {
            "seller_profile.verification_status": "verified",
            "seller_profile.verification_method": "manual",
            "seller_profile.verified_at": new Date(),
            "seller_profile.verified_by": req.user?.userId,
            "seller_profile.is_verified_badge": true,
            "seller_profile.rejection_reason": null,
          }
        : {
            "seller_profile.verification_status": "rejected",
            "seller_profile.is_verified_badge": false,
            "seller_profile.rejection_reason": rejection_reason || "No reason provided",
          };

    const seller = await User.findOneAndUpdate(
      { _id: id, role: "seller" },
      { $set: update },
      { new: true, select: "-password_hash" }
    );

    if (!seller) {
      res.status(404).json({ success: false, message: "Seller not found" });
      return;
    }

    res.json({
      success: true,
      message: `Seller ${action === "approve" ? "verified" : "rejected"}`,
      data: seller,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/admin/vet-records/pending ───────────────────────
export const getPendingVetRecords = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const records = await VetRecord.find({ validation_status: "pending" })
      .populate("horse_id", "name breed seller_id")
      .sort({ created_at: 1 });

    res.json({ success: true, data: records });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/admin/vet-records/:id/validate ──────────────────
export const validateVetRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action, rejection_reason } = req.body;  // "validate" | "reject"

    if (!["validate", "reject"].includes(action)) {
      res.status(400).json({ success: false, message: "action must be 'validate' or 'reject'" });
      return;
    }

    const update =
      action === "validate"
        ? {
            validation_status: "validated",
            validated_by: req.user?.userId,
            validated_at: new Date(),
            rejection_reason: null,
          }
        : {
            validation_status: "rejected",
            rejection_reason: rejection_reason || "No reason provided",
          };

    const record = await VetRecord.findByIdAndUpdate(id, { $set: update }, { new: true });

    if (!record) {
      res.status(404).json({ success: false, message: "Vet record not found" });
      return;
    }

    res.json({ success: true, data: record });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/admin/dashboard ──────────────────────────────────
export const getDashboard = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, pendingSellers, totalHorses, activeListings, pendingVet] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "seller", "seller_profile.verification_status": "pending" }),
      Horse.countDocuments(),
      Horse.countDocuments({ status: "active" }),
      VetRecord.countDocuments({ validation_status: "pending" }),
    ]);

    res.json({
      success: true,
      data: { totalUsers, pendingSellers, totalHorses, activeListings, pendingVet },
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── DELETE /api/admin/horses/:id ─────────────────────────────
// Admin hard-delete of any listing (also in horseController with role check)
export const adminDeleteHorse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Horse.findByIdAndDelete(id);
    await VetRecord.deleteMany({ horse_id: id });
    res.json({ success: true, message: "Listing deleted by admin" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
