import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../models/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';

router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  const exists = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (exists) return res.status(400).json({ error: 'Пользователь уже существует' });

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { username, email, password: hash, role: role || 'user' },
  });

  res.status(201).json({ message: 'Пользователь создан' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Неверный email или пароль' });

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' },
  );

  res.json({ token });
});

router.get('/profile', async (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Нет токена' });

  const token = header.split(' ')[1];

  try {
    const data = jwt.verify(token, JWT_SECRET);
    res.json(data);
  } catch {
    res.status(401).json({ error: 'Токен недействителен' });
  }
});

export default router;
