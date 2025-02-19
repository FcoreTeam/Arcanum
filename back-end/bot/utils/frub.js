import { client } from '../../config/database.js';

export async function frub(ctx) {
    const splited = await ctx.message.text.split(' ')
    var re = new RegExp("/fRub\\s[0-9]+");
    if (!re.test(ctx.message.text)) {
        await ctx.reply('Неверный формат записи (/fRub 4)')
        return
    }
    const info = await client.query('SELECT * FROM users')
    try {
        for (let i = 0; i < info.rows.length; i++) {
            let new_balance = info.rows[i]['balance']
            new_balance = await parseFloat(await new_balance.split('.')[0] + splited[1]) + await new_balance.split('.')[1] / 100
            await client.query('UPDATE users SET balance = $1 WHERE tg_id = $2', [new_balance, info.rows[i]['tg_id']])
        }
        await ctx.reply('Балансы обновлены\nК каждому балансу добавили ' + splited[1])
    } catch (err) {
        await ctx.reply(err.message)
    }
}