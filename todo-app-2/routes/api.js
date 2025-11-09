import express from "express";
import {
  getCategories, getCategoryById, createCategory, updateCategory, deleteCategory
} from "../controllers/categoryController.js";
import {
  getTodos, getTodoById, createTodo, updateTodo, toggleTodo, deleteTodo
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/todos", getTodos);
router.get("/todos/:id", getTodoById);
router.post("/todos", createTodo);
router.put("/todos/:id", updateTodo);
router.patch("/todos/:id/toggle", toggleTodo);
router.delete("/todos/:id", deleteTodo);

export default router;
