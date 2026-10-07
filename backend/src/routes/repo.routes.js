const express = require("express");
const repoController = require("../controllers/repo.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// GitHub repository review route — protected by authentication
router.post("/review", protect, repoController.reviewRepo);

module.exports = router;
