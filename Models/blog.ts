export interface Blog {
  id: number;
  title: string;
  content: string;
  author: string; // or userId if you're tracking users
}

export const blogPosts: Blog[] = [];
let blogIdCounter = 1;

export const generateBlogId = () => blogIdCounter++;
