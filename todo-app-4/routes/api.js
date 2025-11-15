import express from 'express';
import { auth, isAdmin } from '../middleware/auth.js';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from '../controllers/todoController.js';

const router = express.Router();

router.use('/categories', auth, isAdmin);
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/todos', auth, getTodos);
router.get('/todos/:id', auth, getTodoById);
router.post('/todos', auth, createTodo);
router.put('/todos/:id', auth, updateTodo);
router.patch('/todos/:id/toggle', auth, toggleTodo);
router.delete('/todos/:id', auth, deleteTodo);

export default router;
