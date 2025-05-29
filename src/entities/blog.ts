export interface Blog {
  id: number;
  title: string;
  content: string;
  author: string; 
}

export const blogPosts: Blog[] = [];
let blogIdCounter = 1;

export const generateBlogId = () => blogIdCounter++;
