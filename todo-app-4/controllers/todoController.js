import prisma from '../models/db.js';

export const getTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { user_id: req.user.id },
      include: { category: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(todos);
  } catch {
    res.status(500).json({ error: 'Ошибка при получении задач' });
  }
};

export const getTodoById = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await prisma.todo.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!todo) return res.status(404).json({ error: 'Задача не найдена' });

    if (todo.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    res.json(todo);
  } catch {
    res.status(500).json({ error: 'Ошибка при получении задачи' });
  }
};

export const createTodo = async (req, res) => {
  const { title, category_id, due_date } = req.body;

  if (!title || title.trim().length < 2)
    return res.status(400).json({ error: 'Название слишком короткое' });

  try {
    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        category_id: category_id ? Number(category_id) : null,
        due_date: due_date ? new Date(due_date) : null,
        user_id: req.user.id,
      },
    });

    res.status(201).json(todo);
  } catch {
    res.status(500).json({ error: 'Ошибка при создании задачи' });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed, category_id, due_date } = req.body;

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return res.status(404).json({ error: 'Задача не найдена' });

    if (todo.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: {
        title,
        completed,
        category_id: category_id ? Number(category_id) : null,
        due_date: due_date ? new Date(due_date) : null,
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Ошибка при обновлении задачи' });
  }
};

export const toggleTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return res.status(404).json({ error: 'Задача не найдена' });

    if (todo.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Ошибка переключения статуса' });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return res.status(404).json({ error: 'Задача не найдена' });

    if (todo.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Ошибка при удалении задачи' });
  }
};
