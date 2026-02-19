import { Router } from "express";
import {
  listHorses, getHorse, createHorse, updateHorse,
  deleteHorse, myListings, addVetRecord, getVetRecords
} from "../controllers/horseController";
import { authenticate, requireSeller, optionalAuth } from "../middleware/auth";

const router = Router();

// Public
router.get("/",              optionalAuth, listHorses);
router.get("/my-listings",   authenticate, requireSeller, myListings);
router.get("/:id",           optionalAuth, getHorse);
router.get("/:id/vet-records", getVetRecords);

// Protected
router.post("/",     authenticate, requireSeller, createHorse);
router.put("/:id",   authenticate, requireSeller, updateHorse);
router.delete("/:id",authenticate, deleteHorse);      // role checked inside controller

// Vet records
router.post("/:id/vet-record", authenticate, requireSeller, addVetRecord);

export default router;
