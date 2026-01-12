require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const runPlanExpiryJob = require("./src/jobs/planExpiry.job");

connectDB();
runPlanExpiryJob();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
