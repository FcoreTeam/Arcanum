import { Markup, Scenes, session, Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { io } from 'socket.io-client'; // Import socket.io-client
import { client } from '../config/database.js';
import { addUser } from './utils/adduser.js';

dotenv.config();
const token = process.env.TOKEN || null;
export const bot = new Telegraf(token);
const total_url = process.env.DEV_URL || null

bot.use(session());
// Initialize socket
const socket = io('http://localhost:3000'); // Replace with your server URL

const addGameScene = new Scenes.BaseScene("addGame");
const stage = new Scenes.Stage([addGameScene]);
bot.use(stage.middleware());

// Command: /start
bot.start(async (ctx) => {
    await addUser(ctx);
});

addGameScene.enter(async (ctx) => {
    await ctx.reply('Введите ссылку на игру:');
    await console.log(ctx.session);
    await ctx.scene.enter('addGame');
});

bot.command('add_game', async (ctx) => {
    await ctx.scene.enter('addGame');
});

bot.on('message', async (ctx) => {
    await client.query('SELECT * FROM users WHERE tg_id = $1 and is_admin = true', [ctx.from.id]).then(async (data) => {
        if (!data.rowCount) {
            await ctx.reply('Ты не администратор!');
            return;
        }
    });

    if (ctx.message.video) {
        const fileId = ctx.message.video.file_id;

        const fileLink = await ctx.telegram.getFileLink(fileId);
    }
});

bot.launch()