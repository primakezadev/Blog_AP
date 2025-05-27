import express, { Request, Response } from "express";
import { posts, Post } from "./posts";
import { authenticateToken, AuthRequest } from "../ASSIGNMENT/Middlewares/auth";
import { createBlog, blogPosts } from "./blog";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";import express, { Request, Response } from "express";
import { posts, Post } from "./posts";
import { authenticateToken, AuthRequest } from "../ASSIGNMENT/Middlewares/auth";
import { createBlog, blogPosts } from "./blog";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { users, User } from "./users";

dotenv.config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "secret";
let userIdCounter = 1;
let postIdCounter = 1;

// Register endpoint
app.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password }: { username: string; password: string } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const existingUser = users.find((u: User) => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: userIdCounter++,
      username,
      passwordHash,
    };

    users.push(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login endpoint
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password }: { username: string; password: string } = req.body;

    const user = users.find((u: User) => u.username === username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create post endpoint
app.post("/posts", authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const newPost: Post = {
      id: postIdCounter++,
      title,
      content,
      authorId: req.user!.userId,
    };

    posts.push(newPost);
    res.status(201).json({ message: "Post created", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all posts endpoint
app.get("/posts", (req: Request, res: Response) => {
  try {
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update post endpoint
app.put("/posts/:id", authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = posts.find((p) => p.id === parseInt(id));
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.authorId !== req.user!.userId) {
      return res.status(403).json({ message: "Not your post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    res.json({ message: "Post updated", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete post endpoint
app.delete("/posts/:id", authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const index = posts.findIndex((p) => p.id === parseInt(id));
    if (index === -1) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (posts[index].authorId !== req.user!.userId) {
      return res.status(403).json({ message: "Not your post" });
    }

    posts.splice(index, 1);
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create blog post endpoint
app.post("/blogs", authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newPost = createBlog(title, content, req.user!.userId);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all blog posts endpoint
app.get("/blogs", (req: Request, res: Response) => {
  try {
    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import { users, User } from "./users";


dotenv.config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "secret";
let userIdCounter = 1;

app.post("/register", async (req: Request, res: Response) => {
  const { username, password }: { username: string; password: string } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const existingUser = users.find((u: User) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already taken" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: userIdCounter++,
    username,
    passwordHash,
  };

  users.push(newUser);

  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password }: { username: string; password: string } = req.body;

  const user = users.find((u: User) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});
let postIdCounter = 1;

app.post("/posts", authenticateToken, (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  const newPost: Post = {
    id: postIdCounter++,
    title,
    content,
    authorId: req.user!.userId,
  };

  posts.push(newPost);
  res.status(201).json({ message: "Post created", post: newPost });
});

app.get("/posts", (req: Request, res: Response) => {
  res.json(posts);
});

app.put("/posts/:id", authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const post = posts.find(p => p.id === parseInt(id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.authorId !== req.user!.userId) return res.status(403).json({ message: "Not your post" });

  post.title = title || post.title;
  post.content = content || post.content;

  res.json({ message: "Post updated", post });
});

app.delete("/posts/:id", authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const index = posts.findIndex(p => p.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });
  if (posts[index].authorId !== req.user!.userId) return res.status(403).json({ message: "Not your post" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});
app.post("/blogs", authenticateToken, (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const newPost = createBlog(title, content, req.user!.userId);
  res.status(201).json(newPost);
});

// Get all blog posts
app.get("/blogs", (req: Request, res: Response) => {
  res.json(blogPosts);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
