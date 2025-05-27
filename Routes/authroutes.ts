import express from "express";
const router = express.Router();

// Temporary test route
router.get("/test-auth", (req, res) => {
  res.send("Auth route is working!");
});

export default router;
