const express = require("express");
const aiController = require("../controllers/ai.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// AI review route — protected by authentication
router.post("/get-review", protect, aiController.getReview);

module.exports = router;
