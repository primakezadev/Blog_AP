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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
let users = [];
let userIdCounter = 1;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({ message: "email, Username and password required" });
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const newUser = {
            id: userIdCounter++,
            username,
            email,
            passwordHash,
        };
        users.push(newUser);
        res.status(201).json({ message: "User registered", user: { id: newUser.id, username: newUser.username, email: newUser.email
            } });
    }
    catch (err) {
        console.error('register error:', err);
        if (err.code === '23505') {
            res.status(500).json({ message: 'Username or email already exists' });
        }
        else {
            res.status(500).json({ error: 'Server error' });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = users.find((u) => u.username === username);
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.login = login;
