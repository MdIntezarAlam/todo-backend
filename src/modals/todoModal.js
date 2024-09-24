import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
  title: String,
  description: String,
});

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
