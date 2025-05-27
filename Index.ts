// index.ts or server.ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import blogRoutes from "./Routes/blogroutes"; // ✅ import your blog routes
import authroutes from "./Routes/authroutes"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Default welcome route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Prima's Blog API");
});

// ✅ Auth Routes
app.use("/auth", authroutes);



// ✅ Blog CRUD Routes
app.use("/blogs", blogRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
