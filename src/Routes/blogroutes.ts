import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../Controllers/Blogcontroller";
import { authenticateToken } from "../Middlewares/auth";
import { Admin } from "typeorm";

const router = express.Router();

//  Choose this only if auth is required to create a blog
router.post("/", authenticateToken, createBlog);

router.get("/",getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", authenticateToken, updateBlog);
router.delete("/:id", authenticateToken, deleteBlog);

export default router;
