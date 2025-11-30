export default class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = 'error';
    this.isOperational = isOperational;
  }
}
