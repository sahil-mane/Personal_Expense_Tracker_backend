import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();