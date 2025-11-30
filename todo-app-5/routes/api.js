import express from 'express';
import { body, param } from 'express-validator';

import { auth, isAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

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

router.get('/categories', auth, isAdmin, getCategories);

router.get(
  '/categories/:id',
  auth,
  isAdmin,
  param('id').isInt().withMessage('Некорректный id категории'),
  validate,
  getCategoryById,
);

router.post(
  '/categories',
  auth,
  isAdmin,
  body('name').isString().isLength({ min: 2 }).withMessage('Название слишком короткое'),
  validate,
  createCategory,
);

router.put(
  '/categories/:id',
  auth,
  isAdmin,
  param('id').isInt().withMessage('Некорректный id категории'),
  body('name').isString().isLength({ min: 2 }).withMessage('Название слишком короткое'),
  validate,
  updateCategory,
);

router.delete(
  '/categories/:id',
  auth,
  isAdmin,
  param('id').isInt().withMessage('Некорректный id категории'),
  validate,
  deleteCategory,
);

router.get('/todos', auth, getTodos);

router.get(
  '/todos/:id',
  auth,
  param('id').isUUID().withMessage('Некорректный id задачи'),
  validate,
  getTodoById,
);

router.post(
  '/todos',
  auth,
  body('title').isString().isLength({ min: 2 }).withMessage('Название слишком короткое'),
  body('category_id').optional().isInt().withMessage('category_id должен быть числом'),
  body('due_date').optional().isISO8601().withMessage('Некорректная дата'),
  validate,
  createTodo,
);

router.put(
  '/todos/:id',
  auth,
  param('id').isUUID().withMessage('Некорректный id задачи'),
  body('title').optional().isString().isLength({ min: 2 }).withMessage('Название слишком короткое'),
  body('completed').optional().isBoolean().withMessage('completed должен быть boolean'),
  body('category_id').optional().isInt().withMessage('category_id должен быть числом'),
  body('due_date').optional().isISO8601().withMessage('Некорректная дата'),
  validate,
  updateTodo,
);

router.patch(
  '/todos/:id/toggle',
  auth,
  param('id').isUUID().withMessage('Некорректный id задачи'),
  validate,
  toggleTodo,
);

router.delete(
  '/todos/:id',
  auth,
  param('id').isUUID().withMessage('Некорректный id задачи'),
  validate,
  deleteTodo,
);

export default router;
