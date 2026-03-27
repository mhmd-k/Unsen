import express from "express";
import cors from "cors";
import credentials from "./middleware/credentials.js";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";
import authRoutes from "./routes/authRouter.js";
import productRoutes from "./routes/productRouter.js";
import orderRoutes from "./routes/orderRouter.js";
import paymentRouter from "./routes/paymentRouter.js";
import wishlistRouter from "./routes/wishlistRouter.js";
import sellerAnalyticsRouter from "./routes/sellerAnalyticsRouter.js";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

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

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/seller", sellerAnalyticsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.SERVER_URL}`);
});

export { app };
