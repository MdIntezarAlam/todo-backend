import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import todoRouter from "./src/router/todoRouter.js";
import userRouter from "./src/router/userRouter.js";
import addressRouter from "./src/router/addressRouter.js";
import roomRouter from "./src/router/roomRouter.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { socketConnectionController } from "./src/controller/socketController.js";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use("/api/v2", todoRouter);
app.use("/api/v2/auth", userRouter);
app.use("/api/v2/address", addressRouter);
app.use("/api/v2", roomRouter);

socketConnectionController(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
