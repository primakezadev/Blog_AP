import { Request, Response } from "express";
import { Blog } from "../entities/blog";
import { User } from "../entities/User";
import { asyncHandler } from "../Middlewares/errorHandle";
import { AuthRequest } from '../Middlewares/auth';

// ✅ Create Blog
export const createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const blog = Blog.create({
    title,
    content,
    author: req.user,
  });

  await blog.save();
  res.status(201).json(blog);
});

// ✅ Get All Blogs
export const getAllBlogs = asyncHandler(async (_req: Request, res: Response) => {
  const blogs = await Blog.find({ relations: ["author"] });
  res.json(blogs);
});

// ✅ Get Blog By ID
export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findOne({
    where: { id: parseInt(req.params.id) },
    relations: ["author"],
  });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(blog);
});

// ✅ Update Blog
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const blog = await Blog.findOneBy({ id });
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  blog.title = title || blog.title;
  blog.content = content || blog.content;

  await blog.save();
  res.json(blog);
});

// ✅ Delete Blog
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const blog = await Blog.findOneBy({ id });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  await blog.remove();
  res.json({ message: "Blog deleted" });
});
