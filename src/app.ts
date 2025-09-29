import "reflect-metadata";
import express from 'express';
import {connection} from './database/AppDataSource';
import dotenv from "dotenv";

const app = express();
const port = 5001;

dotenv.config();

app.listen(port, async () => {
    try {
        await connection.initialize()
        console.log("Data Source has been initialized!")
    } catch (error) {
        console.error("Error during Data Source initialization", error)
    }
});