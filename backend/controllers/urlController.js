const { nanoid } = require("nanoid");
const validator = require("validator");
const prisma = require("../config/prisma");

const createShortUrl = async (req, res) => {
  try {
    const raw = req.body && req.body.originalUrl;
    const trimmed = typeof raw === "string" ? raw.trim() : raw;
    let normalized = trimmed;
    if (typeof normalized === "string" && !normalized.includes("://")) {
      normalized = "https://" + normalized;
    }

    if (!normalized || !validator.isURL(normalized, { require_protocol: true, allow_localhost: true, host_whitelist: ["localhost"] })) {
      return res.status(400).json({ message: "A valid URL with protocol is required" });
    }

    let parsed;
    try {
      parsed = new URL(normalized);
    } catch (e) {
      return res.status(400).json({ message: "A valid URL with protocol is required" });
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.status(400).json({ message: "Only http and https URLs are allowed" });
    }

    const snapHosts = new Set();
    const candidates = [process.env.BASE_URL, process.env.FRONTEND_URL];
    if (process.env.NODE_ENV !== "production") {
      candidates.push("http://localhost");
    }
    for (const c of candidates) {
      if (!c) continue;
      try {
        snapHosts.add(new URL(c).hostname);
      } catch (e) {
        // skip invalid
      }
    }
    if (snapHosts.has(parsed.hostname)) {
      return res.status(400).json({ message: "This URL points to SnapLink and cannot be shortened" });
    }

    const existing = await prisma.url.findFirst({
      where: { userId: req.user.id, originalUrl: normalized },
    });
    if (existing) {
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      return res.status(200).json({
        message: "Short URL already exists",
        link: existing,
        shortUrl: `${baseUrl}/${existing.shortCode}`,
      });
    }

    const shortCode = nanoid(7);
    const urlDoc = await prisma.url.create({
      data: {
        userId: req.user.id,
        originalUrl: normalized,
        shortCode,
      },
    });

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    return res.status(201).json({
      message: "Short URL created",
      link: urlDoc,
      shortUrl: `${baseUrl}/${shortCode}`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create short URL", error: error.message });
  }
};

const getMyLinks = async (req, res) => {
  try {
    const links = await prisma.url.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(links);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch links", error: error.message });
  }
};

const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await prisma.url.findUnique({ where: { id } });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    if (String(link.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await prisma.url.delete({ where: { id } });
    return res.status(200).json({ message: "Link deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete link", error: error.message });
  }
};

const getLinkStats = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await prisma.url.findUnique({ where: { id } });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    if (String(link.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({
      id: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      clickCount: link.clickCount,
      createdAt: link.createdAt,
      isActive: link.isActive,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

const redirectShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const link = await prisma.url.findFirst({ where: { shortCode, isActive: true } });
    if (!link) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    await prisma.url.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    });
    return res.redirect(link.originalUrl);
  } catch (error) {
    return res.status(500).json({ message: "Redirect failed", error: error.message });
  }
};

module.exports = {
  createShortUrl,
  getMyLinks,
  deleteLink,
  getLinkStats,
  redirectShortUrl,
};
