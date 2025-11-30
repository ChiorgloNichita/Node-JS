// app.js
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import passport from './middleware/passport.js';
import authRoutes from './routes/authRoutes.js';
import apiRouter from './routes/api.js';

import { errorHandler } from './middleware/errorHandler.js';
import { initSentry } from './sentry.js';
import AppError from './utils/AppError.js';

dotenv.config();
const app = express();

// Инициализация Sentry
initSentry();

app.use(express.json());

// Логгирование HTTP-запросов
app.use(morgan('combined'));

app.use(passport.initialize());

app.use('/api/auth', authRoutes);

// Все /api защищены Passport (JWT)
app.use('/api', passport.authenticate('jwt', { session: false }), apiRouter);

// 404 для всех несуществующих маршрутов
app.use((req, _res, next) => {
  next(new AppError(`Маршрут ${req.originalUrl} не найден`, 404));
});

// Централизованный обработчик ошибок
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Сервер запущен: http://localhost:${PORT}`));
