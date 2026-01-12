const express = require("express");
const errorHandler = require("./middlewares/error.middleware");
const path = require("path");

const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/games", require("./routes/game.routes"));
app.use("/api/saved-profiles", require("./routes/savedProfile.routes"));
app.use("/api/reactions", require("./routes/reaction.routes"));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/dashboard", require("./routes/dashboard.routes"));

app.use(errorHandler);

module.exports = app;
