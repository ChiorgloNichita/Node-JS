import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// ======== КАТЕГОРИИ ========

// ✅ Получить все категории
app.get("/api/categories", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// ✅ Получить категорию по ID
app.get("/api/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return res.status(404).json({ error: "Категория не найдена" });
  res.json(category);
});

// ✅ Создать категорию (нужно в BODY: { "name": "Учёба" })
app.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length < 2)
    return res.status(400).json({ error: "Название слишком короткое" });

  const newCat = await prisma.category.create({ data: { name: name.trim() } });
  res.status(201).json(newCat);
});

// ✅ Обновить категорию (BODY: { "name": "Спорт" })
app.put("/api/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });
    res.json(updated);
  } catch {
    res.status(404).json({ error: "Категория не найдена" });
  }
});

// ✅ Удалить категорию
app.delete("/api/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Категория не найдена" });
  }
});

// ======== ЗАДАЧИ (todos) ========

// ✅ Получить все задачи
app.get("/api/todos", async (req, res) => {
  const todos = await prisma.todo.findMany({ include: { category: true } });
  res.json(todos);
});

// ✅ Получить задачу по ID
app.get("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!todo) return res.status(404).json({ error: "Задача не найдена" });
  res.json(todo);
});

// ✅ Создать задачу (BODY: { "title": "Купить молоко", "category_id": 1 })
app.post("/api/todos", async (req, res) => {
  const { title, category_id } = req.body;
  if (!title || title.trim().length < 2)
    return res.status(400).json({ error: "Название слишком короткое" });

  const todo = await prisma.todo.create({
    data: { title: title.trim(), category_id },
  });
  res.status(201).json(todo);
});

// ✅ Изменить задачу (BODY: { "title": "Проверить почту", "completed": true })
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed, category_id } = req.body;
  try {
    const updated = await prisma.todo.update({
      where: { id },
      data: { title, completed, category_id },
    });
    res.json(updated);
  } catch {
    res.status(404).json({ error: "Задача не найдена" });
  }
});

// ✅ Переключить статус задачи
app.patch("/api/todos/:id/toggle", async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return res.status(404).json({ error: "Задача не найдена" });

  const updated = await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });
  res.json(updated);
});

// ✅ Удалить задачу
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Задача не найдена" });
  }
});

// ======== Обработка 404 ========
app.use((req, res) => res.status(404).json({ error: "Маршрут не найден" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сервер запущен: http://localhost:${PORT}`));
