import Todo from "../modals/todoModal.js";
import mongoose from "mongoose";
export const fetchTodo = async (req, res) => {
  try {
    const todos = await Todo.find();
    if (todos) {
      res.status(200).json({
        message: " ",
        success: true,
        data: todos,
      });
    } else {
      res.status(404).json({
        message: "No Todo found",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (todo) {
      res.status(200).json({
        message: "",
        success: true,
        data: todo,
      });
    } else {
      res.status(404).json({
        message: "No Todo found",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      res.status(400).json({ message: "title and description are required" });
    } else {
      const newTodo = new Todo({ title, description });
      const saveTodo = await newTodo.save();
      res.status(200).json({
        message: "Todo created successfully",
        data: saveTodo,
        success: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Todo Id",
        success: false,
      });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({
        message: "Todo Id Not Found!",
        success: false,
      });
    } else {
      const deleteTodo = await Todo.findByIdAndDelete(id);
      return res.status(200).json({
        message: "Todo deleted successfully",
        success: true,
        data: deleteTodo,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

//delete entire todo at one
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.deleteMany();
    if (todo.deletedCount === 0) {
      return res.status(404).json({
        message: "No Todo Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "All Todo deleted successfully",
      success: true,
      dele: todo.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const editTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Todo Id",
        success: false,
      });
    }
    const findId = await Todo.findById(id);
    if (!findId) {
      return res.status(404).json({
        message: "Todo Id Not Found!",
        success: false,
      });
    } else {
      const { title, description } = req.body;
      const updateTodo = await Todo.findByIdAndUpdate(id, {
        title,
        description,
      });
      return res.status(200).json({
        message: "Todo updated successfully",
        success: true,
        data: updateTodo,
      });
    }
  } catch (error) {}
};

//search
