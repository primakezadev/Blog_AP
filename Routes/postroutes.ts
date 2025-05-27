import express from "express";
const router = express.Router();

// Temporary test route
router.get("/test-posts", (req, res) => {
  res.send("Post route is working!");
});

export default router;
