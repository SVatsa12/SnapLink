const { nanoid } = require("nanoid");
const validator = require("validator");
const prisma = require("../config/prisma");

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl || !validator.isURL(originalUrl, { require_protocol: true })) {
      return res.status(400).json({ message: "A valid URL with protocol is required" });
    }

    const shortCode = nanoid(7);
    const urlDoc = await prisma.url.create({
      data: {
        userId: req.user.id,
        originalUrl,
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
