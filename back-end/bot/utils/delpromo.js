import { client } from '../../config/database.js';

export async function delpromo(ctx) {
    const code = await ctx.message.text.split(' ')[1].toLowerCase()
    const info = await client.query('SELECT * FROM promo WHERE code = $1', [code])
    if (info.rows.length <= 0) {
        await ctx.reply(`Промокод ${code} не найден в базе данных`)
        return
    }
    await client.query('DELETE FROM promo WHERE code = $1', [code])
    await ctx.reply(`Промокод ${code} удален из базы данных`)
}