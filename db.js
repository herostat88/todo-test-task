import { MONGO_URL, MONGO_OPT } from './config.js';

import mongoose from "mongoose";

export default async () => {
    try {
        await mongoose.connect(
            MONGO_URL,
            MONGO_OPT
        );

        console.log("Connected to database.");
    } catch (error) {
        console.log("Could not connect to database.", error);
    }
};

