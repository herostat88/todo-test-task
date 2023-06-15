import express from "express";

// Импортируем авторизацию
import isAuth from "../controllers/auth.js";

const router = express.Router();

// API Endpoint: отдает список всех задач
router.get("/tasks", isAuth, async (req, res) => {
    // const user = req.query.task;
    const tasks = await USER.find({}).lean(); // One({'email': user}).lean();

    return res.status(200).send(tasks);
});

export default router;
