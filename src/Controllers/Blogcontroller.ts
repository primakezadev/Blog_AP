import { NextFunction, Request, Response } from "express";
import { blogPosts, Blog, generateBlogId } from "../entities/blog";

// Create
export const createBlog = (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
     res.status(400).json({ message: "All fields required" });
  }

  const newBlog: Blog = {
    id: generateBlogId(),
    title,
    content,
    author
  };

  blogPosts.push(newBlog);
  res.status(201).json(newBlog);
};

// Read all
export const getAllBlogs = (_req: Request, res: Response) => {
  res.json(blogPosts);
};

// Read one
export const getBlogById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const blog = blogPosts.find(b => b.id === id);
  if (!blog)  res.status(404).json({ message: "Blog not found" });

  res.json(blog);
};

// Update
export const updateBlog = async (req: Request, res: Response,next:NextFunction):Promise<void> => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  try{
  const blog = blogPosts.find(b => b.id === id);

  if (!blog){
res.status(404).json({ message: "Blog not found" });
return;
  } 

  if (title) blog.title = title;
  if (content) blog.content = content;

  res.json(blog);
  }catch(err:any){
    res.status(500).json({error:err.message})
  }
};

// Delete
export const deleteBlog = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = blogPosts.findIndex(b => b.id === id);

  if (index === -1)  res.status(404).json({ message: "Blog not found" });

  blogPosts.splice(index, 1);
  res.json({ message: "Blog deleted" });
};
