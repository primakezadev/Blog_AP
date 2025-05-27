import express from "express";
import { register , login } from "../Controllers/authcontroller";


const app = express();
app.use(express.json());

app.post("/register", register);
app.post("/login", login);

export default app;