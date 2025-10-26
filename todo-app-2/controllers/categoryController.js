import prisma from "../models/db.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении категорий" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при создании категории" });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!category) return res.status(404).json({ error: "Категория не найдена" });
  res.json(category);
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(category);
  } catch {
    res.status(404).json({ error: "Категория не найдена" });
  }
};


export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Категория не найдена" });
  }
};
