import { Request, Response } from "express";
import { Types } from "mongoose";
import { Horse } from "../models/Horse";
import { VetRecord } from "../models/VetRecord";
import { AuthRequest } from "../types/index";

// ── GET /api/horses ───────────────────────────────────────────
// Public: list active horses with filters
export const listHorses = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      breed, discipline, country, region,
      min_price, max_price, search,
      page = "1", limit = "12", sort = "created_at",
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { status: "active" };

    if (breed)       filter.breed      = new RegExp(breed, "i");
    if (discipline)  filter.discipline = new RegExp(discipline, "i");
    if (country)     filter["location.country"] = new RegExp(country, "i");
    if (region)      filter["location.region"]  = new RegExp(region, "i");
    if (min_price || max_price) {
      filter.price = {
        ...(min_price && { $gte: Number(min_price) }),
        ...(max_price && { $lte: Number(max_price) }),
      };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const sortField: Record<string, 1 | -1> =
      sort === "price_asc"  ? { price: 1 }         :
      sort === "price_desc" ? { price: -1 }         :
      sort === "age"        ? { age: 1 }            :
                              { created_at: -1 };

    const [horses, total] = await Promise.all([
      Horse.find(filter)
        .sort(sortField)
        .skip(skip)
        .limit(limitNum)
        .populate("seller_id", "full_name seller_profile.is_verified_badge"),
      Horse.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: horses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("listHorses error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/horses/:id ───────────────────────────────────────
// Public: get single horse + increment view count + latest vet record
export const getHorse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(`${id}`)) {
      res.status(400).json({ success: false, message: "Invalid horse ID" });
      return;
    }

    const horse = await Horse.findOneAndUpdate(
      { _id: id, status: "active" },
      { $inc: { views_count: 1 } },
      { new: true }
    ).populate("seller_id", "full_name email phone seller_profile");

    if (!horse) {
      res.status(404).json({ success: false, message: "Horse not found" });
      return;
    }

    // Latest validated vet record
    const latestVet = await VetRecord.findOne({
      horse_id: id,
      validation_status: "validated",
    }).sort({ review_date: -1 });

    res.json({ success: true, data: horse, vet_record: latestVet });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/horses ──────────────────────────────────────────
// Protected (seller/admin): create a horse listing
export const createHorse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const horse = new Horse({
      ...req.body,
      seller_id: req.user?.userId,
      status: "draft",
      views_count: 0,
    });

    await horse.save();

    res.status(201).json({
      success: true,
      message: "Horse listing created",
      data: horse,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ValidationError") {
      res.status(400).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

// ── PUT /api/horses/:id ───────────────────────────────────────
// Protected: update own horse (admin can update any)
export const updateHorse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(`${id}`)) {
      res.status(400).json({ success: false, message: "Invalid horse ID" });
      return;
    }

    const filter =
      req.user?.role === "admin"
        ? { _id: id }
        : { _id: id, seller_id: req.user?.userId };

    const horse = await Horse.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });

    if (!horse) {
      res.status(404).json({ success: false, message: "Horse not found or unauthorized" });
      return;
    }

    res.json({ success: true, data: horse });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ValidationError") {
      res.status(400).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

// ── DELETE /api/horses/:id ────────────────────────────────────
// Seller deletes own | Admin deletes any
export const deleteHorse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(`${id}`)) {
      res.status(400).json({ success: false, message: "Invalid horse ID" });
      return;
    }

    const filter =
      req.user?.role === "admin"
        ? { _id: id }
        : { _id: id, seller_id: req.user?.userId };

    const horse = await Horse.findOneAndDelete(filter);

    if (!horse) {
      res.status(404).json({ success: false, message: "Horse not found or unauthorized" });
      return;
    }

    // Also remove associated vet records
    await VetRecord.deleteMany({ horse_id: id });

    res.json({ success: true, message: "Horse listing deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/horses/my-listings ───────────────────────────────
// Authenticated seller: get own horses
export const myListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const horses = await Horse.find({ seller_id: req.user?.userId }).sort({ created_at: -1 });
    res.json({ success: true, data: horses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/horses/:id/vet-record ──────────────────────────
// Seller adds vet record to own horse
export const addVetRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const horse = await Horse.findOne({
      _id: id,
      seller_id: req.user?.userId,
    });

    if (!horse) {
      res.status(404).json({ success: false, message: "Horse not found or unauthorized" });
      return;
    }

    const record = new VetRecord({
      ...req.body,
      horse_id: id,
      validation_status: "pending",
    });

    await record.save();
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/horses/:id/vet-records ──────────────────────────
// Public: get validated vet records for a horse
export const getVetRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const records = await VetRecord.find({ horse_id: id, validation_status: "validated" })
      .sort({ review_date: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
