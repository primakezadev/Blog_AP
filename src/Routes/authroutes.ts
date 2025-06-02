import express from "express";
import { register, login, verifyEmail, forgotPassword, resetPassword } from "../Controllers/authcontroller";


const app = express();
app.use(express.json());

app.post("/register", register);
app.post("/login", login);
app.get('/verify-email', verifyEmail);
app.post('/forgot-password', forgotPassword);
app.post('/reset-password/:token', resetPassword);

export default app;