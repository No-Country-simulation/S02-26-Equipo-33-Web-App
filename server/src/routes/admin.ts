import { Router } from "express";
import {
  getPendingSellers, verifySeller,
  getPendingVetRecords, validateVetRecord,
  getDashboard, adminDeleteHorse
} from "../controllers/adminController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, requireAdmin);  // all admin routes are protected

router.get( "/dashboard",                getDashboard);
router.get( "/sellers/pending",          getPendingSellers);
router.put( "/sellers/:id/verify",       verifySeller);
router.get( "/vet-records/pending",      getPendingVetRecords);
router.put( "/vet-records/:id/validate", validateVetRecord);
router.delete("/horses/:id",             adminDeleteHorse);

export default router;
