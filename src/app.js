const express = require("express");
const cors = require("cors"); 
const cookieParser = require("cookie-parser"); 
const errorHandler = require("./middlewares/error.middleware");
const path = require("path");
const igdbRoutes = require("./routes/igdb.routes");

const app = express();

// 1. Configure CORS to allow your React frontend
app.use(cors({
  origin: "http://localhost:5173", // Allow ONLY your React dev server
  credentials: true,               // Allow sending/receiving cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Handle preflight requests
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Standard Middlewares
app.use(express.json());
app.use(cookieParser()); // Required to read cookies for Auth

// 3. Routes
app.use("/api/igdb", igdbRoutes);
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/games", require("./routes/game.routes"));
app.use("/api/saved-profiles", require("./routes/savedProfile.routes"));
app.use("/api/reactions", require("./routes/reaction.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/comments", require("./routes/comment.routes"));

// 4. Static Files
app.use(express.static(path.join(__dirname, "../public")));

// 5. Error Handling
app.use(errorHandler);

module.exports = app;
