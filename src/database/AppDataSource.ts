import dotenv from 'dotenv';
import {DataSource} from "typeorm";
import {Usuario} from "../entities/Usuario";
import {Chave} from "../entities/Chave";

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test', override: true });
} else {
    dotenv.config();
}

export const AppDataSource = new DataSource({
    type: "mysql",
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 3306,
    entities: [Usuario, Chave],
    synchronize: true
});