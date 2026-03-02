import { Router } from "express";
import { body } from "express-validator";
import { register, login, getMe, updateSellerProfile } from "../controllers/authController";
import { authenticate, requireSeller } from "../middleware/auth";

const router = Router();

const registerRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("full_name").notEmpty().trim().withMessage("Full name is required"),
  body("phone").optional().matches(/^\+?[1-9][0-9]{7,14}$/).withMessage("Invalid phone number"),
];

const loginRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

router.post("/register", registerRules, register);
router.post("/login",    loginRules,    login);
router.get( "/me",       authenticate,  getMe);

router.put(
  "/seller-profile",
  authenticate,
  requireSeller,
  [
    body("identity_document").notEmpty().withMessage("Identity document required"),
    body("selfie_url").isURL().withMessage("Valid selfie URL required"),
  ],
  updateSellerProfile
);

export default router;
