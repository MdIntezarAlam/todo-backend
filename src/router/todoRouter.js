import express from "express";
import {
  createTodo,
  deleteTodo,
  deleteTodoById,
  editTodo,
  fetchTodo,
  fetchTodoById,
  searchTodo,
} from "../controller/todoController.js";

const router = express.Router();

router.route("/fetch").get(fetchTodo);
router.route("/fetch/:id").get(fetchTodoById);
router.route("/create").post(createTodo);
router.route("/edit/:id").put(editTodo);
router.route("/delete/:id").delete(deleteTodoById);
router.route("/delete").delete(deleteTodo);
router.route("/search/:title").get(searchTodo);

export default router;
