import prisma from "../models/db.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      include: { category: true },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении задач" });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, category_id, due_date } = req.body;
    const todo = await prisma.todo.create({
      data: { title, category_id: category_id ? Number(category_id) : null, due_date },
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при создании задачи" });
  }
};

export const getTodoById = async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!todo) return res.status(404).json({ error: "Задача не найдена" });
  res.json(todo);
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed, category_id } = req.body;
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { title, completed, category_id: category_id ? Number(category_id) : null },
    });
    res.json(todo);
  } catch {
    res.status(404).json({ error: "Задача не найдена" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Задача не найдена" });
  }
};

export const toggleTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return res.status(404).json({ error: "Задача не найдена" });

  const updated = await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });

  res.json(updated);
};
