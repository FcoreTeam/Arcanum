import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import game_router from './routes/game.router.js';
import user_router from './routes/user.router.js';
import leaderboard_router from './routes/leaderboard.router.js';
import { bot } from './bot/bot.js';
import path from 'path';
import cors from 'cors';
import { client } from './config/database.js';
import { Server } from 'socket.io';
import http from 'http';
import { handleConnection } from './socket.js';
import { initCreateAllTables } from './config/initCreateAllTables.js';
initCreateAllTables(client);


dotenv.config();

export let total_url = process.env.DEV_URL || null

const app = express();
const ws_app = http.createServer(app);
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8000",
    "https://zoltansgametma.ru",
    "*"
];

ws_app.listen(5000, () => {
    console.log(`Вебсокет пашет на ${5000} порте!`);
});

export const io = new Server(ws_app, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    handleConnection(socket, io);
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error'); // Или res.status(404).send('File not found');
        }
    });
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
}));

app.use('/games', game_router);
app.use('/users', user_router);
app.use('/leaderboard', leaderboard_router);

app.use(async (req, res) => {
    try {
        const games = await client.query(`SELECT * FROM games`);
        await games.rows.forEach(async (game) => {
            if (new Date() < new Date(game.date+1)) return;
            const leaderboard = await client.query(
                `SELECT * FROM leaderboard l 
                LEFT JOIN users ON l.user_id = users.id
                WHERE l.game_id = $1 ORDER BY l.created_at ASC limit 8`, [game.id]);
            for (let i = 10; i >= 3; i--) {
                if (leaderboard.rows[10-i] == undefined || leaderboard.rows[10-i].is_rewarded) continue;
                await client.query(`UPDATE users SET balance = balance + $1 WHERE id = $2`, [i, leaderboard.rows[10-i].user_id]);   
                await client.query(`UPDATE leaderboard SET is_rewarded = true WHERE user_id = $1`, [leaderboard.rows[10-i].user_id]);             
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})