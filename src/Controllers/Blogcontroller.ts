import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Blog } from "../entities/blog";
import { User } from "../entities/User";
import { asyncHandler } from "../Middlewares/errorHandle";
import { AuthRequest } from "../Middlewares/auth";

// Get the Blog repository once
const blogRepository = AppDataSource.getRepository(Blog);

// Create Blog
export const createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const blog = blogRepository.create({
    title,
    content,
    author: req.user, // Make sure Blog has a 'ManyToOne' relationship with User
  });

  await blogRepository.save(blog);
  res.status(201).json(blog);
});

// Get All Blogs
export const getAllBlogs = asyncHandler(async (_req: Request, res: Response) => {
  const blogs = await blogRepository.find({ relations: ["author"] });
  res.json(blogs);
});

// Get Blog By ID
export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogRepository.findOne({
    where: { id: parseInt(req.params.id) },
    relations: ["author"],
  });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(blog);
});

// Update Blog
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const blog = await blogRepository.findOneBy({ id });
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  blog.title = title || blog.title;
  blog.content = content || blog.content;

  await blogRepository.save(blog);
  res.json(blog);
});

// Delete Blog
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const blog = await blogRepository.findOneBy({ id });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  await blogRepository.remove(blog);
  res.json({ message: "Blog deleted" });
});
