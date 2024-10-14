import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  author: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
