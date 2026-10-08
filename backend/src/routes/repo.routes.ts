import express from "express";
import { reviewRepo } from "../controllers/repo.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// GitHub repository review route — protected by authentication
router.post("/review", protect, reviewRepo);

export default router;
