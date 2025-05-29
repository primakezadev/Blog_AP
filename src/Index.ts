import express, { Request, Response } from "express";
import dotenv from "dotenv";
import blogRoutes from "./Routes/blogroutes"; 
import authroutes from "./Routes/authroutes";
import userRoutes from './Routes/userroutes'; // ✅ new

import { AppDataSource } from "./config/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Prima's Blog API");
});

app.use("/auth", authroutes);
app.use("/blogs", blogRoutes);
app.use("/users", userRoutes); 

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on http://localhost:" + port);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
