import express, { Request, Response } from "express";
import dotenv from "dotenv";
import  cors from 'cors';
import blogRoutes from "./Routes/blogroutes"; 
import authroutes from "./Routes/authroutes";
import userRoutes from './Routes/userroutes'; 
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import { AppDataSource } from "./config/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
 
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Prima's Blog API");
});

app.use("/auth", authroutes);
app.use("/blogs", blogRoutes);
app.use("/users", userRoutes); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on http://localhost:" + port);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
