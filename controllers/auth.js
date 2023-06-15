import { JWT_SECRET } from '../config.js';

import jwt from 'jsonwebtoken';

// Функция авторизации
export default function isAuth(req, res, next) {
    const authHeader = req.get("Authorization");

    // Если токена нет в заголовке - запрос не авторизован
    if (!authHeader) {
        return res.status(401).json({ message: 'Not authenticated!' });
    };

    // Извлекаем токен из заголовка
    const token = authHeader.split(' ')[1];
    let decodedToken; 

    // Если токен проходит проверку тогда пропускаем запрос дальше
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        // Если проверка проходит с ошибкой тогда отказываем в запросе
        return res.status(500).json({ message: err.message || 'Could not decode token' });
    };

    // Доп. проверка на случай пустого токена
    if (!decodedToken) {
        return res.status(401).json({ message: 'Unauthorized access!' });
    } else {
        next();
    };
};

