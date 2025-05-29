import express from "express";
import {getAllUsers,getById,updateUser,deleteUser,search,} from '../Controllers/userscontroller';
import { authenticateToken } from "../Middlewares/auth";

const router = express.Router();

// Public or authenticated routes
router.get("/", getAllUsers);
router.get("/search", search);
router.get("/:id", getById);

// Protected routes
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
