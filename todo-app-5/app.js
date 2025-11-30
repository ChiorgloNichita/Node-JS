import express from 'express';
import dotenv from 'dotenv';
import passport from './middleware/passport.js';

import authRoutes from './routes/authRoutes.js';
import apiRouter from './routes/api.js';

import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema.js';

import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(passport.initialize());

app.use('/api/auth', authRoutes);

app.use('/api', passport.authenticate('jwt', { session: false }), apiRouter);

import { auth } from './middleware/auth.js';

app.use(
  '/graphql',
  graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: { user: req.user },
  })),
);

app.use((req, res) => {
  return res.status(404).json({
    status: 'error',
    message: `Маршрут ${req.originalUrl} не найден`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен: http://localhost:${PORT}`));
