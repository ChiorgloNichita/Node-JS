import prisma from "../models/db.js";

// GET /api/todos
export const getTodos = async (_req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      include: { category: true },
      orderBy: { created_at: "desc" },
    });
    res.json(todos);
  } catch {
    res.status(500).json({ error: "Ошибка при получении задач" });
  }
};

// GET /api/todos/:id
export const getTodoById = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) }, // ✅ преобразуем id в число
      include: { category: true },
    });
    if (!todo) return res.status(404).json({ error: "Задача не найдена" });
    res.json(todo);
  } catch {
    res.status(500).json({ error: "Ошибка при получении задачи" });
  }
};

// POST /api/todos
export const createTodo = async (req, res) => {
  const { title, category_id, due_date } = req.body;
  if (!title || title.trim().length < 2)
    return res.status(400).json({ error: "Название слишком короткое" });

  try {
    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        category_id: category_id ? Number(category_id) : null, // ✅ приводим к числу
        due_date: due_date ? new Date(due_date) : null,
      },
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при создании задачи" });
  }
};

// PUT /api/todos/:id
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed, category_id, due_date } = req.body;
  try {
    const todo = await prisma.todo.update({
      where: { id: Number(id) }, // ✅
      data: {
        title,
        completed,
        category_id: category_id ? Number(category_id) : null,
        due_date,
      },
    });
    res.json(todo);
  } catch {
    res.status(404).json({ error: "Задача не найдена" });
  }
};

// PATCH /api/todos/:id/toggle
export const toggleTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findUnique({ where: { id: Number(id) } }); // ✅
    if (!todo) return res.status(404).json({ error: "Задача не найдена" });
    const updated = await prisma.todo.update({
      where: { id: Number(id) },
      data: { completed: !todo.completed },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Ошибка при переключении статуса" });
  }
};

// DELETE /api/todos/:id
export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.todo.delete({ where: { id: Number(id) } }); // ✅
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Задача не найдена" });
  }
};
