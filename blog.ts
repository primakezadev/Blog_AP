

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export const blogPosts: BlogPost[] = [];
let blogIdCounter = 1;

export function createBlog(title: string, content: string, authorId: number): BlogPost {
  const newPost: BlogPost = {
    id: blogIdCounter++,
    title,
    content,
    authorId,
  };
  blogPosts.push(newPost);
  return newPost;
}
