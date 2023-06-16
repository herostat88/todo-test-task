import * as dotenv from 'dotenv';

import http from 'http';
import mongoose from 'mongoose';
import express, { Application } from 'express';

// Загружаем глобальные переменные
dotenv.config();

// Импортируем API рутеры
import { tasksRouter } from './routes/tasks';
import { usersRouter } from './routes/users';

// Создаем сервер
const app: Application = express();

// Подключаемся к БД
mongoose.connect(process.env.MONGO_URL!)
    .then(() => {
        // Используем JSON формат для входящих запросов
        app.use(express.json());

        // Подключаем обработчики маршрутов к серверу
        app.use("/tasks", tasksRouter);
        app.use("/users", usersRouter);

        // Запускаем сервер на выбранном порту
        http.createServer(app).listen(process.env.PORT, () => { console.log(`HTTP Server running on port ${process.env.PORT}`); });
    })
    .catch((error: Error) => {
        console.log('DB connection failed', error);
        process.exit();
    });
