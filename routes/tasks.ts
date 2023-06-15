import { Types } from 'mongoose';
import express, { Request, Response } from "express";
import Task from '../models/task';
import { ITask, ITaskDocument } from '../interfaces/ITask';

// Импортируем авторизацию
import isAuth from "../controllers/auth.js";

// Настройка рутера
export const tasksRouter = express.Router();
tasksRouter.use(express.json());

// API Endpoints

// Отдает список всех задач
tasksRouter.get("/", isAuth, async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const tasks: Array<ITaskDocument> = await Task.find({})
            .limit(+limit * 1)
            .skip((+page - 1) * +limit);

        // Считаем общее кол-во тасков в базе
        const count = await Task.countDocuments();

        return res.status(200).json({
            tasks,
            totalPages: Math.ceil(count / +limit),
            currentPage: page,
        });
    } catch(error) {
        return res.status(500).send(getErrorMessage(error));
    }
});

// Создает задачу
tasksRouter.post("/", isAuth, async (req: Request, res: Response) => {
    try {
        const task = req.body as ITask;
        const result = await Task.create(task);

        result
            ? res.status(200).json({'id': result._id})
            : res.status(500).send('Unable to create new task');
    } catch(error) {
        return res.status(500).send(getErrorMessage(error));
    }
});

// Возвращает задачу по ID
tasksRouter.get("/:id", isAuth, async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new Types.ObjectId(id) };
        const result = await Task.findOne(query);

        result
            ? res.status(200).send(result)
            : res.status(500).send(`Unable to fetch task with id ${id}`);
    } catch(error) {
        return res.status(500).send(getErrorMessage(error));
    }
});

// Обновляет задачу по ID
tasksRouter.put("/:id", isAuth, async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const task = req.body as ITask;
        const query = { _id: new Types.ObjectId(id) };

        const result = await Task.findOneAndUpdate(query, {$set: task}, {new: true});

        result
            ? res.status(200).send(result)
            : res.status(500).send(`Unable to update task ${id}`);
    } catch(error) {
        return res.status(500).send(getErrorMessage(error));
    }
});

// Удаляет задачу по ID
tasksRouter.delete("/:id", isAuth, async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new Types.ObjectId(id) };
        const result = await Task.deleteOne(query);

        result
            ? res.status(200).send(result)
            : res.status(500).send(`Unable to delete task ${id}`);
    } catch(error) {
        return res.status(500).send(getErrorMessage(error));
    }
});

// Хелпер для форматирования ошибок
function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
