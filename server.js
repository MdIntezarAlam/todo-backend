import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import todoRouter from "./src/router/todoRouter.js";
import userRuter from "./src/router/userRouter.js";
import addressRouter from "./src/router/addressRouter.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
connectDB();

app.use("/api/v2", todoRouter);
app.use("/api/v2/auth", userRuter);
app.use("/api/v2/address", addressRouter);

app.listen(PORT, () => {
  console.log(`server is running on localhost ${PORT}`);
});
