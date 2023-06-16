import * as dotenv from 'dotenv';

import jwt from 'jsonwebtoken';
import express, { Request, Response } from "express";
import User from '../models/user';
import { IUser } from '../interfaces/IUser';

// Загружаем глобальные переменные
dotenv.config();

// Настройка рутера
export const usersRouter = express.Router();
usersRouter.use(express.json());

usersRouter.post("/expired", async (req: Request, res: Response) => {
    // Получаем хедер с токеном из запроса
    const authHeader = req.get("Authorization");

    // Если хедер пустой тогда авторизация провалена
    if (!authHeader) {
        return res.status(500);
    };

    // Извлекаем непосредсвенно сам токен из хедера
    const token = authHeader.split(' ')[1];
    let decodedToken; 

    // Проверяем токен на валид
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
        return res.status(500);
    };

    if (!decodedToken) {
        return res.status(500);
    } else {
        // Все ок, токен декодирован, авторизация прошла успешно
        return res.status(200).send({message: true});
    };
});

// Функция авторизации по email/password
usersRouter.post("/login", async (req: Request, res: Response) => {
    // Получаем email/pass из запроса
    const { email, password } = req.body;

    // Ищем пользователя в БД
    const user = await User.findOne({"email": email, "password": password});

    // Если пользователь существует тогда создаем для него токен
    if(user) {
        // Создаем новый токен
        const token = jwt.sign({ "email": email }, process.env.JWT_SECRET!, { "expiresIn": process.env.JWT_EXPIRE! });

        // Возращаем новый токен
        return res.status(200).json({"token": token});
    }

    // Проверка провалена, даем отказ авторизации
    return res.status(500).send({message: 'Incorrect `Email` or `Password`! Please try again!'});
});

// Регистрация нового пользователя
usersRouter.post("/register", async (req: Request, res: Response) => {
    // Добавляем нового пользователя в БД
    try {
        const user = req.body as IUser;
        const result = await User.create(user);

        // Если регистрация прошла успешно тогда создаем новый токен и возвращаем пользователю
        if(result) {
            // Создаем новый токен
            const token = jwt.sign({ "email": user.email }, process.env.JWT_SECRET!, { "expiresIn": process.env.JWT_EXPIRE! });

            // Возращаем новый токен
            return res.status(200).json({"token": token});
        } else {
            return res.status(500).send('Unable to create new user');
        }
    } catch (error) {
        return res.status(500).send(getErrorMessage(error));
    }
});

// Хелпер для форматирования ошибок
function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
