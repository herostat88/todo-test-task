import jwt from 'jsonwebtoken';
import express from 'express';

import { JWT_SECRET, JWT_EXPIRE } from './config.js';

import USER from "../models/user.js";

const router = express.Router();

router.post("/expired", async (req, res) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(500);
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 

    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(500);
    };

    if (!decodedToken) {
        return res.status(500);
    } else {
        return res.status(200).send({message: true});
    };
});

// Функция авторизации по email/password
router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await USER.findOne({"email": email, "password": password});

    if(user) {
        // Создаем новый токен
        const token = jwt.sign({ "email": email }, JWT_SECRET, { "expiresIn": JWT_EXPIRE });

        // Возращаем новый токен вместе с именем пользователя и e-mail
        return res.status(200).json({"user": email, "name": user.name, "token": token});
    }

    // Проверка провалена, даем отказ авторизации
    return res.status(500).send({message: 'Incorrect `Email` or `Password`! Please try again!'});
});

router.post("/register", async (req, res) => {
    const { name, email, password, passwordrepeat } = req.body;
    if(password !== passwordrepeat) return res.status(500).send({message: 'Passwords must match!'});

    const user = new USER({name, email, password});
    try {
        user.save((err) => {
            if(err) return res.status(500).send({message: 'Error registering new user! Try again!'});
            else return res.status(200).send({message: 'Please contact Administrator for account verification!'});
        });
    } catch (error) {
        return res.status(500).send({message: 'Error registering new user!'});
    }
});

export default router;
