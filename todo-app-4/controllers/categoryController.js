import prisma from '../models/db.js';

export const getCategories = async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
};

export const getCategoryById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ error: 'Категория не найдена' });
    res.json(category);
  } catch {
    res.status(500).json({ error: 'Ошибка при получении категории' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2)
      return res.status(400).json({ error: 'Название слишком короткое' });
    const category = await prisma.category.create({ data: { name: name.trim() } });
    res.status(201).json(category);
  } catch {
    res.status(500).json({ error: 'Ошибка при создании категории' });
  }
};

export const updateCategory = async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });
    res.json(category);
  } catch {
    res.status(404).json({ error: 'Категория не найдена' });
  }
};

export const deleteCategory = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Категория не найдена' });
  }
};
