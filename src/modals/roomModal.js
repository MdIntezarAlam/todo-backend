import mongoose from "mongoose";
import { reasonType } from "../../helper/state.js";

const roomSchema = new mongoose.Schema({
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
const Room = mongoose.model("Room", roomSchema);
export default Room;
