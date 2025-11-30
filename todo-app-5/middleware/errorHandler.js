import AppError from '../utils/AppError.js';
import logger from '../logger/logger.js';
import * as Sentry from '@sentry/node';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (!(err instanceof AppError && err.statusCode === 400)) {
    Sentry.captureException(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};
