const express = require("express");
const cors = require("cors");
const path = require("path");

const errorHandler = require("./middlewares/error.middleware");

const igdbRoutes = require("./routes/igdb.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const gameRoutes = require("./routes/game.routes");
const savedProfileRoutes = require("./routes/savedProfile.routes");
const reactionRoutes = require("./routes/reaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const commentRoutes = require("./routes/comment.routes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/igdb", igdbRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/saved-profiles", savedProfileRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/comments", commentRoutes);

/* ---------------- Static ---------------- */
app.use(express.static(path.join(__dirname, "../public")));

app.use(errorHandler);

module.exports = app;
