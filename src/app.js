const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error.middleware");
const path = require("path");
const igdbRoutes = require("./routes/igdb.routes");

require("./config/passport");

const app = express();

app.disable("x-powered-by");

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === "null") return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/igdb", igdbRoutes);
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/games", require("./routes/game.routes"));
app.use("/api/saved-profiles", require("./routes/savedProfile.routes"));
app.use("/api/reactions", require("./routes/reaction.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/comments", require("./routes/comment.routes"));
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.use(express.static(path.join(__dirname, "../public")));

app.use(errorHandler);

module.exports = app;
