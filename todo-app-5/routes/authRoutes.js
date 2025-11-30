import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

import prisma from '../models/db.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';

router.post(
  '/register',
  body('username').isString().isLength({ min: 2 }).withMessage('Имя пользователя слишком короткое'),
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  validate,
  catchAsync(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    const exists = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (exists) {
      return next(new AppError('Пользователь уже существует', 400));
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { username, email, password: hash, role: role || 'user' },
    });

    res.status(201).json({ message: 'Пользователь создан' });
  }),
);

router.post(
  '/login',
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 1 }).withMessage('Пароль обязателен'),
  validate,
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError('Неверный email или пароль', 401));
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return next(new AppError('Неверный email или пароль', 401));
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' },
    );

    res.json({ token });
  }),
);

router.get(
  '/profile',
  catchAsync(async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
      return next(new AppError('Нет токена', 401));
    }

    const token = header.split(' ')[1];

    try {
      const data = jwt.verify(token, JWT_SECRET);
      res.json(data);
    } catch {
      return next(new AppError('Токен недействителен', 401));
    }
  }),
);

export default router;
