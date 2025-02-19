import { client } from '../../config/database.js';

export async function setSizePic(ctx) {
    let re = new RegExp(/^\/setSizePic\s\d+-\d+$/);
    if (!re.test(ctx.message.text)) {
        await ctx.reply('Неверный формат записи (/setSizePic 10-20)')
        return
    }
    const splited = await ctx.message.text.split(' ')
    const size = await splited[1].split('-').map(el => parseInt(el))
    try {
        await client.query(`UPDATE users SET size_pic = int4range(${size[0]}, ${size[1]-1}, '[]')`)
        await client.query(`ALTER TABLE users ALTER COLUMN size_pic SET DEFAULT int4range(${size[0]}, ${size[1]-1}, '[]')`)
        await ctx.reply(`Размер загружаемых файлов обновлен до ${size[0]}-${size[1]}`)
    } catch (err) {
        await ctx.reply(err.message)
    }
}