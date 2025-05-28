import express from "express";
import cors from "cors";
import credentials from "./middleware/credentials.js";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";
import authRoutes from "./routes/authRouter.js";
import "dotenv/config";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middlewares
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// Example route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app };
