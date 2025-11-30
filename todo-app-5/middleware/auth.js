import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';

export const auth = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return next(new AppError('Требуется авторизация', 401));
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.userId,
      role: payload.role,
      username: payload.username,
    };
    next();
  } catch {
    return next(new AppError('Неверный токен', 401));
  }
};

export const isAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Доступ запрещён', 403));
  }
  next();
};
