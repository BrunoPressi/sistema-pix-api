import "reflect-metadata";
import {AppDataSource} from './database/AppDataSource';
import express from 'express';
import routes from "./routes";

const app = express();
const port = 5001;
app.use(express.json());
app.use(routes);

AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`API is running on http://localhost:${port}`);
        });
    })
    .catch((error) => console.log("Error during Data Source initialization", error));