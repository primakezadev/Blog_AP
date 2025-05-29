
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import blogRoutes from "./Routes/blogroutes"; 
import authroutes from "./Routes/authroutes"
import {AppDataSource} from "./config/db"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Default welcome route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Prima's Blog API");
});

// Auth Routes
app.use("/auth", authroutes);



//  Blog CRUD Routes
app.use("/blogs", blogRoutes);

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log("Server is running on http://localhost:" + port);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
