const prisma = require("./prisma");

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set (see backend/.env.example)");
    }
    // Verify DATABASE_URL is valid and DB reachable at boot.
    await prisma.$queryRaw`SELECT 1`;
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("PostgreSQL connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
