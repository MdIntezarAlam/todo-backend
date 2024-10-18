import express from "express";
import {
  fetchSingleTicket,
  fetchTickets,
  ticketController,
} from "../controller/ticketController.js";

const router = express.Router();

router.route("/fetch-ticket").get(fetchTickets);
router.route("/fetch-ticket/:id").get(fetchSingleTicket);
router.route("/create-ticket").post(ticketController);

export default router;
