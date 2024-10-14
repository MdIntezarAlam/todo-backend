import express from "express";
import {
  fetchRoomTickets,
  roomController,
} from "../controller/roomController.js";

const router = express.Router();

router.route("/create-ticket").post(roomController);
router.route("/fetch-ticket").get(fetchRoomTickets);

export default router;
