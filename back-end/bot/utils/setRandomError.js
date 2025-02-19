import { client } from '../../config/database.js';

export async function setRandomError(ctx) {
    let re = new RegExp(/^\/setRandomError\s\d+(\.\d+)?$/);
    if (!re.test(ctx.message.text)) {
        await ctx.reply('Неверный формат записи (/setRandomError 10) или (/setRandomError 10.50)')
        return
    }
    const splited = await ctx.message.text.split(' ')
    const size = await parseFloat(splited[1]).toFixed(2)
    if (size > 100 || size < 0) {
        await ctx.reply('Неверное значение')
        return
    }
    try {
        await client.query(`UPDATE users SET percent_error = ${size}`)
        await client.query(`ALTER TABLE users ALTER COLUMN percent_error SET DEFAULT ${size}`)
        await ctx.reply(`Рандомная ошибка обновлена до ${size}`)
    } catch (err) {
        console.log(err)
        await ctx.reply(err.message)
    }
}