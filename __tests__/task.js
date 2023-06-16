import * as dotenv from 'dotenv';

import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';

// Импортируем модели для работы с БД
import User from '../models/user';
import Task from '../models/task';

// Импортируем API рутеры
import { tasksRouter } from '../routes/tasks';
import { usersRouter } from '../routes/users';

// Загружаем глобальные переменные
dotenv.config();

// Создаем сервер
const app = express();

// Используем JSON формат для входящих запросов
app.use(express.json());

// Подключаем обработчики маршрутов к серверу
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

// Тестовый пользователь
const test_user = {
    'email': 'test@gmail.com',
    'password': '12343pass'
};

describe('Task', () => {
    // Глобальная переменная для токена
    var token = '';

    // Тестовые таски
    const test_task = {
        'title': 'test task title',
        'content': 'new task content test'
    };

    const test_task_updated= {
        'title': 'updated task title',
        'content': 'updated task content!'
    };

    // Подключаемся к БД перед началом тестов
    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URL);
    });

    // Отключаемся от БД после тестов
    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    // Создаем пользователя и авторизуемся для каждого теста
    beforeEach(async () => {
        const response = await request(app).post('/users/register').send(test_user);
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
        token = response.body.token;
    });

    // Очищаем БД после каждого теста
    afterEach(async () => {
        token = '';
        await User.deleteMany();
        await Task.deleteMany();
    });

    test('Создание новой задачи', async() => {
        // Создаем новую задачу
        const response = await request(app).post('/tasks').send(test_task).set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);

        // Проверяем что задача есть в БД
        const task = await request(app).get('/tasks/'+response.body.id).set('Authorization', `Bearer ${token}`);
;
        expect(task.statusCode).toBe(200);
        expect(task.body._id).toEqual(response.body.id);
        expect(task.body.title).toEqual(test_task.title);
        expect(task.body.content).toEqual(test_task.content);
    });

    test('Удаление задачи', async() => {
        // Создаем новую задачу
        const response = await request(app).post('/tasks').send(test_task).set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);

        // Проверяем что задача есть в БД
        const task = await request(app).get('/tasks/'+response.body.id).set('Authorization', `Bearer ${token}`);
        expect(task.statusCode).toBe(200);
        expect(task.body._id).toEqual(response.body.id);
        expect(task.body.title).toEqual(test_task.title);
        expect(task.body.content).toEqual(test_task.content);

        // Удаляем задачу
        const deleted = await request(app).delete('/tasks/'+response.body.id).set('Authorization', `Bearer ${token}`);
        expect(deleted.statusCode).toBe(200);
        expect(deleted.body.deletedCount).toBe(1);
    });

    test('Обновление задачи', async() => {
        // Создаем новую задачу
        const response = await request(app).post('/tasks').send(test_task).set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);

        // Проверяем что задача есть в БД
        const task = await request(app).get('/tasks/'+response.body.id).set('Authorization', `Bearer ${token}`);
        expect(task.statusCode).toBe(200);
        expect(task.body._id).toEqual(response.body.id);
        expect(task.body.title).toEqual(test_task.title);
        expect(task.body.content).toEqual(test_task.content);

        // Обновляем задачу
        const updated = await request(app).put('/tasks/'+response.body.id).send(test_task_updated).set('Authorization', `Bearer ${token}`);
        expect(updated.statusCode).toBe(200);
        expect(updated.body._id).toEqual(response.body.id);
        expect(updated.body.title).toEqual(test_task_updated.title);
        expect(updated.body.content).toEqual(test_task_updated.content);
    });

    test('Список всех задач', async () => {
        const response = await request(app).get('/tasks').set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
    });
});

describe('User', () => {
    // Подключаемся к БД перед началом тестов
    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URL);
    });

    // Отключаемся от БД после тестов
    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    // Очищаем БД после каждого теста
    afterEach(async () => {
        await User.deleteMany();
        await Task.deleteMany();
    })

    test('Создание нового пользователя', async () => {
        const response = await request(app).post('/users/register').send(test_user);
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
    });

    test('Авторизация пользователя', async () => {
        // Создаем пользователя
        const response = await request(app).post('/users/register').send(test_user);
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();

        // Авторизуем его
        const user = await request(app).post('/users/login').send(test_user);
        expect(user.statusCode).toBe(200);
        expect(user.body.token).toBeTruthy();
    });
});

