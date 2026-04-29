const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createShortUrl,
  getMyLinks,
  deleteLink,
  getLinkStats,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/create", authMiddleware, createShortUrl);
router.get("/my-links", authMiddleware, getMyLinks);
router.delete("/:id", authMiddleware, deleteLink);
router.get("/stats/:id", authMiddleware, getLinkStats);

module.exports = router;
