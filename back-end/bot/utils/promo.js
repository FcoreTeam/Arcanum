import { Markup } from 'telegraf'
import { client } from '../../config/database.js';

export async function promo(ctx) {
    const dis = await parseFloat(ctx.message.text.split(' ')[2]).toFixed(2)
    const code = await ctx.message.text.split(' ')[1].toLowerCase()
    if (dis == undefined || code == undefined) {
        await ctx.reply('Неверный формат записи (/promo halloween 10) или (/promo bonus 10.50)')
    }
    const info = await client.query('SELECT * FROM promo WHERE code = $1', [code])
    if (info.rows.length > 0) {
        await ctx.reply(`Промокод ${code} уже существует`)
        await ctx.reply(`Хотите удалить промокод?`,
            await Markup.inlineKeyboard([
                await Markup.button.callback('Да', JSON.stringify({ action: 'delpromo', code: code })),
                await Markup.button.callback('Нет', JSON.stringify({ action: 'cancel' }))
            ]))
        return
    }
    await client.query('INSERT INTO promo (code, discount) VALUES ($1, $2)', [code, dis])
    await ctx.reply(`Промокод ${code} добавлен в базу данных`)
}