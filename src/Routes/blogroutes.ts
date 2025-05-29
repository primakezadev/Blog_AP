import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../Controllers/Blogcontroller"; // Make sure the path and file name are correct
import { authenticateToken } from "../Middlewares/auth";

const router = express.Router();

router.post("/", createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.post("/", authenticateToken, createBlog);
export default router;
