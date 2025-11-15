import express from 'express';
import dotenv from 'dotenv';
import passport from './middleware/passport.js';

import authRoutes from './routes/authRoutes.js';
import apiRouter from './routes/api.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(passport.initialize());

app.use('/api/auth', authRoutes);

app.use('/api', passport.authenticate('jwt', { session: false }), apiRouter);

app.use((req, res) => res.status(404).json({ error: 'Маршрут не найден' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Сервер запущен: http://localhost:${PORT}`));
