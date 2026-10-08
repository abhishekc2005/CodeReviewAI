import express from "express";
import { getReview, fixCode } from "../controllers/ai.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// AI review route — protected by authentication
router.post("/get-review", protect, getReview);

// AI fix code route — protected by authentication
router.post("/fix-code", protect, fixCode);

export default router;
