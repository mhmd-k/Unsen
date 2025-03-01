const express = require("express");
const cors = require("cors");
const credentials = require("./middleware/credentials");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const authRoutes = require("./routes/authRouter");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");
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

module.exports = {
  app,
};
