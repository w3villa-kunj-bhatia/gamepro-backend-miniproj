const express = require("express");
const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query missing" });
    }

    res.json({
      success: true,
      query: q,
      results: [],
    });
  } catch (err) {
    res.status(500).json({ error: "IGDB search failed" });
  }
});

module.exports = router;
