import * as dotenv from 'dotenv';

import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';

// Импортируем маршрут авторизации
// import auth from "./routes/auth.js";

// Импортируем task API рутер
import { tasksRouter } from '../routes/tasks';

// Импортируем API задач
//import tasks from '../routes/tasks.js';
//import {describe} from 'node:test';

// Загружаем глобальные переменные
dotenv.config();

// Создаем сервер
const app = express();

// Используем JSON формат для входящих запросов
app.use(express.json());

// Подключаем обработчики маршрутов к серверу
// app.use("/auth", auth);
app.use("/tasks", tasksRouter);

const test_task = {
    'title': 'test task title',
    'content': 'new task content test'
};

const test_task_updated= {
    'title': 'updated task title',
    'content': 'updated task content!'
};

describe('Task', () => {
    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URL);
    });

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    test('Создание новой задачи', async() => {
        // Создаем новую задачу
        const response = await request(app).post('/tasks').send(test_task);
        expect(response.statusCode).toBe(200);

        // Проверяем что задача есть в БД
        const task = await request(app).get('/tasks/'+response.body.id);
        expect(task.statusCode).toBe(200);
        expect(task.body._id).toEqual(response.body.id);
        expect(task.body.title).toEqual(test_task.title);
        expect(task.body.content).toEqual(test_task.content);
    });

    test('Удаление задачи', async() => {
        // Создаем новую задачу
        const response = await request(app).post('/tasks').send(test_task);
        expect(response.statusCode).toBe(200);

        // Проверяем что задача есть в БД
        const task = await request(app).get('/tasks/'+response.body.id);
        expect(task.statusCode).toBe(200);
        expect(task.body._id).toEqual(response.body.id);
        expect(task.body.title).toEqual(test_task.title);
        expect(task.body.content).toEqual(test_task.content);

        // Удаляем задачу
        const deleted = await request(app).delete('/tasks/'+response.body.id);
        expect(deleted.statusCode).toBe(200);
        expect(deleted.body.deletedCount).toBe(1);
    });

    test('Обновление задачи', async() => {
        // Создаем новую задачу
        const response = await request(app).post('/tasks').send(test_task);
        expect(response.statusCode).toBe(200);

        // Проверяем что задача есть в БД
        const task = await request(app).get('/tasks/'+response.body.id);
        expect(task.statusCode).toBe(200);
        expect(task.body._id).toEqual(response.body.id);
        expect(task.body.title).toEqual(test_task.title);
        expect(task.body.content).toEqual(test_task.content);

        // Обновляем задачу
        const updated = await request(app).put('/tasks/'+response.body.id).send(test_task_updated);
        expect(updated.statusCode).toBe(200);
        expect(updated.body._id).toEqual(response.body.id);
        expect(updated.body.title).toEqual(test_task_updated.title);
        expect(updated.body.content).toEqual(test_task_updated.content);
    });

    test('Список всех задач', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
    });
});
