import { client } from '../../config/database.js';

export async function set(ctx) {
    const splited = await ctx.message.text.split(' ')
    if (splited.length != 4) {
        await ctx.reply('Неверный формат записи (/set [rub/gb] [username/tgid] [кол-во])')
        return
    }
    if (splited[1] != 'rub' && splited[1] != 'gb') {
        await ctx.reply('Неверный формат записи (/set [rub/gb] [username/tgid] [кол-во])')
        return
    }
    let rub_gb = 'current_storage'
    if (splited[1] == 'rub') {
        rub_gb = 'balance'
    }
    const u_tg = splited[2]
    const count = await parseFloat(splited[3]).toFixed(2)
    if (isNaN(count)) {
        await ctx.reply('Неверный формат записи (/set [rub/gb] [username/tgid] [кол-во])')
        return
    }

    let info = await client.query('SELECT * FROM users WHERE username = $1', [u_tg])
    if (info.rows.length <= 0) {
        info = await client.query('SELECT * FROM users WHERE tg_id = $1', [u_tg])
        if (info.rows.length <= 0) {
            await ctx.reply('Пользователь не найден')
            return
        }
    }
    const who = info.rows[0].tg_id
    try {
        await client.query(`UPDATE users SET ${rub_gb} = $1 WHERE tg_id = $2`, [count, who])
        await ctx.reply(`Поле ${rub_gb} для @${info.rows[0]['username']} обновлено на значение ${count}`)
    } catch (err) {
        await ctx.reply(err.message)
    }
}