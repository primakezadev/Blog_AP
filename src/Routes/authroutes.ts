import express from "express";
import { register , login,verifyEmail } from "../Controllers/authcontroller";


const app = express();
app.use(express.json());

app.post("/register", register);
app.post("/login", login);
app.get('/verify-email', verifyEmail);

export default app;