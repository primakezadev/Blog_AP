"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Blogcontroller_1 = require("../Controllers/Blogcontroller"); // Make sure the path and file name are correct
const auth_1 = require("../Middlewares/auth");
const router = express_1.default.Router();
router.post("/", Blogcontroller_1.createBlog);
router.get("/", Blogcontroller_1.getAllBlogs);
router.get("/:id", Blogcontroller_1.getBlogById);
router.put("/:id", Blogcontroller_1.updateBlog);
router.delete("/:id", Blogcontroller_1.deleteBlog);
router.post("/", auth_1.authenticateToken, Blogcontroller_1.createBlog);
exports.default = router;
