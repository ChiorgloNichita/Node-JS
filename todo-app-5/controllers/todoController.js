// controllers/todoController.js
import prisma from '../models/db.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getTodos = catchAsync(async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: { user_id: req.user.id },
    include: { category: true },
    orderBy: { created_at: 'desc' },
  });

  res.json(todos);
});

export const getTodoById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const todo = await prisma.todo.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!todo) {
    return next(new AppError('Задача не найдена', 404));
  }

  if (todo.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Нет доступа', 403));
  }

  res.json(todo);
});

export const createTodo = catchAsync(async (req, res) => {
  const { title, category_id, due_date } = req.body;

  const todo = await prisma.todo.create({
    data: {
      title: title.trim(),
      category_id: category_id ? Number(category_id) : null,
      due_date: due_date ? new Date(due_date) : null,
      user_id: req.user.id,
    },
  });

  res.status(201).json(todo);
});

export const updateTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, completed, category_id, due_date } = req.body;

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return next(new AppError('Задача не найдена', 404));
  }

  if (todo.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Нет доступа', 403));
  }

  const updated = await prisma.todo.update({
    where: { id },
    data: {
      title: title !== undefined ? title : todo.title,
      completed: typeof completed === 'boolean' ? completed : todo.completed,
      category_id: category_id ? Number(category_id) : null,
      due_date: due_date ? new Date(due_date) : null,
    },
  });

  res.json(updated);
});

export const toggleTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return next(new AppError('Задача не найдена', 404));
  }

  if (todo.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Нет доступа', 403));
  }

  const updated = await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });

  res.json(updated);
});

export const deleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return next(new AppError('Задача не найдена', 404));
  }

  if (todo.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Нет доступа', 403));
  }

  await prisma.todo.delete({ where: { id } });
  res.status(204).send();
});
