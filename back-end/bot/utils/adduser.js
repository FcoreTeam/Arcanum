import { client } from "../../config/database.js";
import { Markup } from 'telegraf';
import { bot } from "../bot.js";

let url = process.env.DEV_URL

export async function addUser(ctx) {
    if (url === null) {
        await ctx.reply('Что-то пошло не так')
        return
    }
    const total_url = `${url}?user_id=${ctx.from.id}`;
    let query = `SELECT * FROM users WHERE id = ${ctx.from.id}`;
    let info = await client.query(query);
    if (info.rows.length == 0) {
        await client.query(`INSERT INTO users (id, username, first_name) VALUES ($1, $2, $3)`, [ctx.from.id, ctx.from.username, ctx.from.first_name]);
        await bot.telegram.getUserProfilePhotos(ctx.from.id).then(async (data) => {
            if (data.total_count == 0) return;
            await bot.telegram.getFileLink(data.photos[0][0].file_id).then(async (data) => {
                client.query(`UPDATE users SET avatar_url = '${data.href}' WHERE id = ${ctx.from.id}`);
            });
        })
        await ctx.reply('Привет, ' + (ctx.from.username || ctx.from.first_name),
            await Markup.keyboard([
                await Markup.button.webApp('Let\'s go', total_url),
            ], ).resize());
    } else {
        await client.query(`UPDATE users set username = $2, first_name = $3 WHERE id = $1`, [ctx.from.id, ctx.from.username, ctx.from.first_name]);
        await bot.telegram.getUserProfilePhotos(ctx.from.id).then(async (data) => {
            if (data.total_count == 0) return;
            await bot.telegram.getFileLink(data.photos[0][0].file_id).then(async (data) => {
                client.query(`UPDATE users SET avatar_url = '${data.href}' WHERE id = ${ctx.from.id}`);
            });
        })
        await ctx.reply('Привет, ' + (ctx.from.username || ctx.from.first_name) + '. Еще раз!', 
            await Markup.keyboard([
                await Markup.button.webApp('Let\'s go', total_url),
            ], ).resize());
    }
};