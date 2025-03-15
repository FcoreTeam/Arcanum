import { Markup } from 'telegraf'
import { client } from '../../config/database.js';
import { bot } from '../../bot/bot.js';
import dotenv from 'dotenv';
import { total_url } from '../../app.js';
dotenv.config('../../.env');

let url = process.env.NGROK

export async function addUser(ctx) {
    const user = await client.query('SELECT * FROM users WHERE tg_id = $1', [ctx.from.id]);
    if (user.rowCount) return;
    await client.query('INSERT INTO users (tg_id, first_name, username, avatar_url) VALUES ($1, $2, $3, $4)', [ctx.from.id, ctx.from.first_name , ctx.from.username, '']);
    await bot.telegram.getUserProfilePhotos(ctx.from.id).then(async (data) => {
        if (data.total_count == 0) return;
        await bot.telegram.getFileLink(data.photos[0][0].file_id).then(async (data) => {
            client.query(`UPDATE users SET avatar_url = '${data.href}' WHERE tg_id = ${ctx.from.id}`);
        });
    })
    await ctx.reply('Привет, ' + ctx.from.username + '. Еще раз!', 
        await Markup.keyboard([
            await Markup.button.webApp('Let\'s go', total_url),
    ], ).resize());
};
