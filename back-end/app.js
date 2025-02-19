import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes/router.js';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { bot } from './bot/bot.js';
import { client } from './config/database.js';
import { initCreateAllTables } from './config/initCreateAllTables.js';
initCreateAllTables(client);


dotenv.config();

export let total_url = process.env.DEV_URL || null

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const logDirectory = path.join(__dirname, 'logs');
const infoLogStream = fs.createWriteStream(path.join(logDirectory, 'info.log'), { flags: 'a' });
export const errorLogStream = fs.createWriteStream(path.join(logDirectory, 'error.log'), { flags: 'a' });

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

bot.launch();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(morgan('combined', { stream: infoLogStream }));
app.use(cors());
app.use(router)
