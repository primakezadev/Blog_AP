"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBlogId = exports.blogPosts = void 0;
exports.blogPosts = [];
let blogIdCounter = 1;
const generateBlogId = () => blogIdCounter++;
exports.generateBlogId = generateBlogId;
