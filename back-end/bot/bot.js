import { Markup, Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import { addUser } from './utils/adduser.js'
import { updateUser } from '../controllers/user.js'
import { client } from '../config/database.js'
import { frub } from './utils/frub.js'
import { set } from './utils/set.js'
import { setSizePic } from './utils/setsizepic.js'
import { setPayPic } from './utils/setpaypic.js'
import { RubLimit } from './utils/rublimit.js'
import { setRandomError } from './utils/setRandomError.js'
import { promo } from './utils/promo.js'
import { delpromo } from './utils/delpromo.js'
import { setGb } from './utils/setGb.js'

dotenv.config()

const token = process.env.TOKEN || null
export const bot = new Telegraf(token)

bot.start(async (ctx) => {
    await addUser(ctx);
})

bot.command('spam', async (ctx) => {
    let re = new RegExp('/spam\\sTg')
    if (!re.test(ctx.message.text)) {
        await ctx.reply('Неверный формат записи (/spam Tg)')
        return
    }
    const info = await client.query(`SELECT tg_id FROM users`)
    await info.rows.forEach(async (row) => {
        const message = ctx.message.reply_to_message
        bot.telegram.copyMessage(row.tg_id, ctx.chat.id, message.message_id);
    })
})

bot.command('fRub', async (ctx) => {
    await frub(ctx)
})

bot.command('set', async (ctx) => {
    await set(ctx)
})

bot.command('setSizePic', async (ctx) => {
    await setSizePic(ctx)
})

bot.command('setPayPic', async (ctx) => {
    await setPayPic(ctx)
})

bot.command('RubLimit', async (ctx) => {
    await RubLimit(ctx)
})

bot.command('link', async (ctx) => {
    const url = `https://t.me/${ctx.botInfo.username}?start=${ctx.from.id}`
    await ctx.reply(`Ссылка для рефералов: ${url}`)
    await updateUser(ctx)
})

bot.command('setRandomError', async (ctx) => {
    await setRandomError(ctx)
})

bot.command('promo', async (ctx) => {
    await promo(ctx)
})

bot.command('delpromo', async (ctx) => {
    await delpromo(ctx)
})

bot.command('setGb', async (ctx) => {
    await setGb(ctx)
})

bot.on('message', async (ctx) => {
    await updateUser(ctx)
})

bot.on('callback_query', async (ctx) => {
    const data = JSON.parse(ctx.callbackQuery.data);
    if (data.action.includes('delpromo')) {
        await client.query('DELETE FROM promo WHERE code = $1', [data.code])
        await ctx.editMessageText('Промокод удален')
    } else {
        await ctx.deleteMessage()
    }
})