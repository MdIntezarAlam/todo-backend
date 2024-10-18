import mongoose from "mongoose";
import { reasonType } from "../../helper/state.js";

const ticketSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  reasonType: {
    type: String,
    enum: reasonType,
    default: "normal_contact",
    trim: true,
    required: true,
  },
});
const Ticket = mongoose.model("ticket", ticketSchema);
export default Ticket;
