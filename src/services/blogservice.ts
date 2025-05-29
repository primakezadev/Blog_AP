import { Blog } from "../entities/blog";
import { User } from "../entities/User";

export const createBlogService = async (
  title: string,
  content: string,
  authorId: number
): Promise<Blog> => {
  const user = await User.findOneBy({ id: authorId });
  if (!user) {
    throw new Error("Author not found");
  }

  const blog = Blog.create({
    title,
    content,
    author: user,
  });

  return await blog.save();
};

export const getAllBlogsService = async (): Promise<Blog[]> => {
  return await Blog.find({ relations: ["author"] });
};

export const getBlogByIdService = async (id: number): Promise<Blog | null> => {
  return await Blog.findOne({
    where: { id },
    relations: ["author"],
  });
};

export const updateBlogService = async (
  id: number,
  title?: string,
  content?: string
): Promise<Blog | null> => {
  const blog = await Blog.findOneBy({ id });
  if (!blog) return null;

  blog.title = title ?? blog.title;
  blog.content = content ?? blog.content;

  return await blog.save();
};

export const deleteBlogService = async (id: number): Promise<boolean> => {
  const blog = await Blog.findOneBy({ id });
  if (!blog) return false;

  await blog.remove();
  return true;
};
