const { PrismaClient } = require("@prisma/client");

// Reuse the PrismaClient in dev to avoid exhausting connections with hot reload.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;

