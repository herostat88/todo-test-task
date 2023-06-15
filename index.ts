import http from "http";
import express from "express";

// Импортируем соединение к БД
import connection from "./db.js";

// Импортируем маршрут авторизации
import auth from "./routes/auth.js";

// Импортируем API задач
import tasks from './routes/tasks.js';

const port = process.env.PORT || 8080;

// Создаем сервер
const app = express();

// Подключаемся к БД
connection();

// Используем JSON формат для входящих запросов
app.use(express.json());

// Подключаем обработчики маршрутов к серверу
app.use("/auth", auth);
app.use("/tasks", tasks);

// Запускаем сервер на выбранном порту
http.createServer(app).listen(port, () => { console.log(`HTTP Server running on port ${port}`); });

