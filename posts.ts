// posts.ts

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export const posts: Post[] = [];
