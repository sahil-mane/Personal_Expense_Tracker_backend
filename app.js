import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDatabase from "./db.js";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API is running 🚀",
  });
});

app.use("/api/expenses", expenseRoutes);



app.use((error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid expense ID." });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);

  res.status(500).json({
    message: "Something went wrong.",
  });
});

export default app;