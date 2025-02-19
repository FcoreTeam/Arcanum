import { client } from '../../config/database.js';

export async function RubLimit(ctx) {
    let re = new RegExp(/^\/RubLimit\s\d+(\.\d+)?$/);
    if (!re.test(ctx.message.text)) {
        await ctx.reply('Неверный формат записи (/RubLimit 10) или (/RubLimit 10.50)')
        return
    }
    const splited = await ctx.message.text.split(' ')
    const size = await parseFloat(splited[1]).toFixed(2)
    try {
        await client.query(`UPDATE users SET max_balance = ${size}`)
        await client.query(`ALTER TABLE users ALTER COLUMN max_balance SET DEFAULT ${size}`)
        await ctx.reply(`Лимит в рублях обновлен до ${size}`)
    } catch (err) {
        await console.log(err)
        await ctx.reply(err.message)
    }
}