import * as dotenv from 'dotenv';

import http from 'http';
import mongoose from 'mongoose';
import express, { Application } from 'express';

// Импортируем маршрут авторизации
// import auth from "./routes/auth.js";

// Загружаем глобальные переменные
dotenv.config();

// Импортируем task API рутер
import { tasksRouter } from './routes/tasks';

// Создаем сервер
const app: Application = express();

// Подключаемся к БД
mongoose.connect(process.env.MONGO_URL!)
    .then(() => {
        // Используем JSON формат для входящих запросов
        app.use(express.json());

        // Подключаем обработчики маршрутов к серверу
        // app.use("/auth", auth);
        app.use("/tasks", tasksRouter);

        // Запускаем сервер на выбранном порту
        http.createServer(app).listen(process.env.PORT, () => { console.log(`HTTP Server running on port ${process.env.PORT}`); });
    })
    .catch((error: Error) => {
        console.log('DB connection failed', error);
        process.exit();
    });
