"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const blog_1 = require("../entities/blog");
// Create
const createBlog = (req, res) => {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
        res.status(400).json({ message: "All fields required" });
    }
    const newBlog = {
        id: (0, blog_1.generateBlogId)(),
        title,
        content,
        author
    };
    blog_1.blogPosts.push(newBlog);
    res.status(201).json(newBlog);
};
exports.createBlog = createBlog;
// Read all
const getAllBlogs = (_req, res) => {
    res.json(blog_1.blogPosts);
};
exports.getAllBlogs = getAllBlogs;
// Read one
const getBlogById = (req, res) => {
    const id = parseInt(req.params.id);
    const blog = blog_1.blogPosts.find(b => b.id === id);
    if (!blog)
        res.status(404).json({ message: "Blog not found" });
    res.json(blog);
};
exports.getBlogById = getBlogById;
// Update
const updateBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    try {
        const blog = blog_1.blogPosts.find(b => b.id === id);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        if (title)
            blog.title = title;
        if (content)
            blog.content = content;
        res.json(blog);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateBlog = updateBlog;
// Delete
const deleteBlog = (req, res) => {
    const id = parseInt(req.params.id);
    const index = blog_1.blogPosts.findIndex(b => b.id === id);
    if (index === -1)
        res.status(404).json({ message: "Blog not found" });
    blog_1.blogPosts.splice(index, 1);
    res.json({ message: "Blog deleted" });
};
exports.deleteBlog = deleteBlog;
