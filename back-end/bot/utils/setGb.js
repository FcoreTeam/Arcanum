import { client } from '../../config/database.js';

export async function setGb(ctx) {
    let re = new RegExp(/^\/setGb\s[0-9]+(\.[0-9]+)?$/);
    if (!re.test(ctx.message.text)) {
        await ctx.reply('Неверный формат записи (/setGb 10) или (/setGb 10.50)')
        return
    }
    const splited = await ctx.message.text.split(' ')
    const size = await parseFloat(splited[1]).toFixed(2)
    try {
        await client.query(`ALTER TABLE users ALTER COLUMN max_storage SET DEFAULT ${size}`)
        await ctx.reply(`ГБ для новых юзеров обновлены до ${size} ГБ`)
    } catch (err) {
        await console.log(err)
        await ctx.reply(err.message)
    }
}