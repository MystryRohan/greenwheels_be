import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import wheelsRouter from "./routes/wheelsRouter.js";
import cors from "cors";

const app = express();
config({ path: "config.env" });

// connecting db
const db = () =>
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "greenwheels" })
    .then(() => {
      console.log("db connected...");
    })
    .catch((e) => {
      console.log("error", e);
    });

db();

//using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URI1, process.env.FRONTEND_URI2],
    methods: ["POST", "GET", "UPDATE", "DELETE"],
    credentials: true,
  })
);

//using routes
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/wheels/", wheelsRouter);

app.get("/", (req, res) => {
  res.send("green wheels");
});
app.listen(process.env.PORT, () => {
  console.log("server is running on port", process.env.PORT);
});
