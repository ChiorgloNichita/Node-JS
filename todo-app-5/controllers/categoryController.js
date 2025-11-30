// controllers/categoryController.js
import prisma from '../models/db.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getCategories = catchAsync(async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' },
  });
  res.json(categories);
});

export const getCategoryById = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return next(new AppError('Категория не найдена', 404));
  }

  res.json(category);
});

export const createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;

  const category = await prisma.category.create({
    data: { name: name.trim() },
  });

  res.status(201).json(category);
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return next(new AppError('Категория не найдена', 404));
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name: name.trim() },
  });

  res.json(category);
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return next(new AppError('Категория не найдена', 404));
  }

  await prisma.category.delete({ where: { id } });
  res.status(204).send();
});
