import { client } from '../../config/database.js';

export async function setPayPic(ctx) {
    let re = new RegExp(/^\/setPayPic\s\d+-\d+$/);
    if (!re.test(ctx.message.text)) {
        await ctx.reply('Неверный формат записи (/setPayPic 10-20) или (/setPayPic 10-20)')
        return
    }
    const splited = await ctx.message.text.split(' ')
    const size = await splited[1].split('-').map(el => parseInt(el))
    try {
        await client.query(`UPDATE users SET pay_pic = int4range(${size[0]}, ${size[1]-1}, '[]')`)
        await client.query(`ALTER TABLE users ALTER COLUMN pay_pic SET DEFAULT int4range(${size[0]}, ${size[1]-1}, '[]')`)
        await ctx.reply(`Оплата за фото обновлена до интервала ${size[0]}-${size[1]}`)
    } catch (err) {
        console.log(err)
        await ctx.reply(err.message)
    }
}