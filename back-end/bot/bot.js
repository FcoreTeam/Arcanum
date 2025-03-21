import { Markup, Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { io } from 'socket.io-client'; // Import socket.io-client
import { client } from '../config/database.js';
import { addUser } from './utils/adduser.js';

dotenv.config();
const token = process.env.TOKEN || null;
export const bot = new Telegraf(token);
const total_url = process.env.DEV_URL || null

// Initialize socket
const socket = io('http://localhost:3000'); // Replace with your server URL

// Command: /start
bot.start(async (ctx) => {
    await addUser(ctx);
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